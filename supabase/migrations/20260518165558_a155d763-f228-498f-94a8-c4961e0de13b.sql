
-- ============ CONVERSATIONS ============
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_preview TEXT
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.conversation_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, user_id)
);
CREATE INDEX idx_cp_user ON public.conversation_participants(user_id);
CREATE INDEX idx_cp_conv ON public.conversation_participants(conversation_id);
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- security definer helper to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_conv UUID, _user UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = _conv AND user_id = _user
  )
$$;

CREATE POLICY "Participants view conversation" ON public.conversations FOR SELECT TO authenticated
  USING (public.is_conversation_participant(id, auth.uid()));
CREATE POLICY "Authenticated create conversation" ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Participants update conversation" ON public.conversations FOR UPDATE TO authenticated
  USING (public.is_conversation_participant(id, auth.uid()));

CREATE POLICY "Participants view participants" ON public.conversation_participants FOR SELECT TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "Insert self as participant" ON public.conversation_participants FOR INSERT TO authenticated
  WITH CHECK (true);

-- ============ MESSAGES ============
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text','audio','file','image','call')),
  content TEXT,
  media_url TEXT,
  media_name TEXT,
  media_size BIGINT,
  duration_seconds INT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_conv ON public.messages(conversation_id, created_at);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants read messages" ON public.messages FOR SELECT TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "Participants send messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "Participants update own messages" ON public.messages FOR UPDATE TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()));

-- Trigger to update conversation last_message
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      last_message_preview = CASE NEW.type
        WHEN 'text' THEN LEFT(COALESCE(NEW.content,''), 100)
        WHEN 'audio' THEN '🎤 Audio'
        WHEN 'file' THEN '📎 ' || COALESCE(NEW.media_name,'File')
        WHEN 'image' THEN '🖼️ Image'
        WHEN 'call' THEN '📞 Call'
        ELSE ''
      END,
      updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_update_conversation_on_message
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.update_conversation_on_message();

-- Helper: find or create a 1:1 conversation between current user and other
CREATE OR REPLACE FUNCTION public.get_or_create_direct_conversation(_other UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _me UUID := auth.uid();
  _conv UUID;
BEGIN
  IF _me IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;

  SELECT cp1.conversation_id INTO _conv
  FROM public.conversation_participants cp1
  JOIN public.conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
  WHERE cp1.user_id = _me AND cp2.user_id = _other
  LIMIT 1;

  IF _conv IS NULL THEN
    INSERT INTO public.conversations DEFAULT VALUES RETURNING id INTO _conv;
    INSERT INTO public.conversation_participants (conversation_id, user_id) VALUES (_conv, _me), (_conv, _other);
  END IF;
  RETURN _conv;
END;
$$;

-- ============ CALL SIGNALING ============
CREATE TABLE public.call_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  from_user UUID NOT NULL,
  to_user UUID NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('offer','answer','ice','hangup','ring')),
  payload JSONB,
  call_kind TEXT CHECK (call_kind IN ('audio','video')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_call_signals_to ON public.call_signals(to_user, created_at);
ALTER TABLE public.call_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read own call signals" ON public.call_signals FOR SELECT TO authenticated
  USING (to_user = auth.uid() OR from_user = auth.uid());
CREATE POLICY "Send call signals" ON public.call_signals FOR INSERT TO authenticated
  WITH CHECK (from_user = auth.uid() AND public.is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "Delete own call signals" ON public.call_signals FOR DELETE TO authenticated
  USING (from_user = auth.uid() OR to_user = auth.uid());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_signals;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.call_signals REPLICA IDENTITY FULL;

-- ============ STORAGE: chat-media (private) ============
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-media', 'chat-media', false)
ON CONFLICT (id) DO NOTHING;

-- Path: {conversation_id}/{user_id}/{filename}
CREATE POLICY "Participants read chat media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'chat-media' AND public.is_conversation_participant(((storage.foldername(name))[1])::uuid, auth.uid()));
CREATE POLICY "Participants upload chat media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chat-media' AND public.is_conversation_participant(((storage.foldername(name))[1])::uuid, auth.uid()) AND (storage.foldername(name))[2] = auth.uid()::text);
CREATE POLICY "Owners delete chat media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'chat-media' AND (storage.foldername(name))[2] = auth.uid()::text);
