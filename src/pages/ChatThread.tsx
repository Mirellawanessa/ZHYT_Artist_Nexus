import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, MoreVertical, Phone, Search, Paperclip, Mic, Send, Download, Play, Pause, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCall } from "@/components/chat/CallProvider";
import { toast } from "sonner";

interface Message {
  id: string;
  sender_id: string;
  type: "text" | "audio" | "file" | "image" | "call";
  content: string | null;
  media_url: string | null;
  media_name: string | null;
  media_size: number | null;
  duration_seconds: number | null;
  created_at: string;
}

interface OtherProfile { user_id: string; display_name: string; avatar_url: string | null; }

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function AudioBubble({ url, duration }: { url: string; duration: number | null }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => { if (!ref.current) return; if (playing) ref.current.pause(); else ref.current.play(); }}
        className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
      <div className="flex items-end gap-0.5 h-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="w-0.5 bg-current opacity-70 rounded" style={{ height: `${30 + ((i * 17) % 70)}%` }} />
        ))}
      </div>
      <span className="text-[11px] opacity-70">{duration ? `${duration}s` : ""}</span>
      <audio ref={ref} src={url} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
    </div>
  );
}

export default function ChatThread() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const call = useCall();

  const [messages, setMessages] = useState<Message[]>([]);
  const [other, setOther] = useState<OtherProfile | null>(null);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const recChunksRef = useRef<BlobPart[]>([]);
  const recStartRef = useRef<number>(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { if (!loading && !user) navigate("/"); }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || !conversationId) return;
    (async () => {
      // load other participant
      const { data: parts } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", conversationId)
        .neq("user_id", user.id);
      const otherId = parts?.[0]?.user_id;
      if (otherId) {
        const { data: prof } = await supabase
          .from("profiles").select("user_id, display_name, avatar_url").eq("user_id", otherId).maybeSingle();
        if (prof) setOther(prof as OtherProfile);
      }
      const { data: msgs } = await supabase
        .from("messages").select("*").eq("conversation_id", conversationId).order("created_at");
      setMessages((msgs ?? []) as Message[]);
    })();
    const ch = supabase.channel(`thread_${conversationId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (p) => setMessages((m) => [...m, p.new as Message]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, conversationId]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  const sendText = async () => {
    if (!text.trim() || !user || !conversationId) return;
    const t = text.trim();
    setText("");
    await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: user.id, type: "text", content: t });
    textareaRef.current?.focus();
  };

  const uploadAndSend = async (blob: Blob, fileName: string, type: "audio" | "file" | "image", duration?: number) => {
    if (!user || !conversationId) return;
    setUploading(true);
    try {
      const path = `${conversationId}/${user.id}/${Date.now()}-${fileName}`;
      const { error: upErr } = await supabase.storage.from("chat-media").upload(path, blob);
      if (upErr) throw upErr;
      const { data: signed } = await supabase.storage.from("chat-media").createSignedUrl(path, 60 * 60 * 24 * 365);
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        type,
        media_url: signed?.signedUrl ?? null,
        media_name: fileName,
        media_size: blob.size,
        duration_seconds: duration ?? null,
      });
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally { setUploading(false); }
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRecRef.current = rec; recChunksRef.current = []; recStartRef.current = Date.now();
      rec.ondataavailable = (e) => recChunksRef.current.push(e.data);
      rec.onstop = async () => {
        const dur = Math.round((Date.now() - recStartRef.current) / 1000);
        const blob = new Blob(recChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        await uploadAndSend(blob, `voice-${Date.now()}.webm`, "audio", dur);
      };
      rec.start();
      setRecording(true);
    } catch { toast.error("Microphone permission denied"); }
  };
  const stopRec = () => { mediaRecRef.current?.stop(); setRecording(false); };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const isImg = f.type.startsWith("image/");
    await uploadAndSend(f, f.name, isImg ? "image" : "file");
    e.target.value = "";
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background max-w-md mx-auto w-full">
      <header className="flex items-center gap-2 px-3 py-3 border-b border-border bg-background sticky top-0 z-10">
        <button onClick={() => navigate("/chat")} className="p-1 rounded-full hover:bg-muted"><ChevronLeft className="w-5 h-5" /></button>
        {other?.avatar_url ? (
          <img src={other.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : <div className="w-10 h-10 rounded-full bg-muted" />}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{other?.display_name ?? "..."}</p>
          <p className="text-[11px] text-success">Online</p>
        </div>
        <button onClick={() => other && conversationId && call.startCall(other.user_id, conversationId, "audio")} className="p-2 rounded-full hover:bg-muted" aria-label="Voice call"><Phone className="w-5 h-5" /></button>
        <button onClick={() => other && conversationId && call.startCall(other.user_id, conversationId, "video")} className="p-2 rounded-full hover:bg-muted" aria-label="Video call"><Video className="w-5 h-5" /></button>
        <button className="p-2 rounded-full hover:bg-muted"><MoreVertical className="w-5 h-5" /></button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <p className="text-center text-xs text-muted-foreground">Today</p>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <div className="bg-accent rounded-2xl px-6 py-4 mb-4">
              <p className="text-sm font-medium">No messages yet…</p>
              <p className="text-xs text-muted-foreground mt-1">Send a message or reply with a greeting sticker below!</p>
            </div>
            <button onClick={() => { setText("Hello! 👋"); setTimeout(sendText, 50); }} className="bg-primary-soft text-primary-foreground rounded-2xl px-6 py-3 border border-primary/30">
              <span className="text-primary font-bold text-lg">Hello! 👋</span>
            </button>
          </div>
        )}
        {messages.map((m) => {
          const mine = m.sender_id === user.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 ${mine ? "bg-[hsl(var(--chat-outgoing))] text-[hsl(var(--chat-outgoing-foreground))]" : "bg-[hsl(var(--chat-incoming))] text-[hsl(var(--chat-incoming-foreground))]"}`}>
                {m.type === "text" && <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>}
                {m.type === "audio" && m.media_url && <AudioBubble url={m.media_url} duration={m.duration_seconds} />}
                {m.type === "image" && m.media_url && <img src={m.media_url} alt="" className="rounded-lg max-w-full max-h-72 object-cover" />}
                {m.type === "file" && m.media_url && (
                  <a href={m.media_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm underline">
                    <Download className="w-4 h-4" /> {m.media_name}
                  </a>
                )}
                <p className="text-[10px] opacity-60 mt-1 text-right">{formatTime(m.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border bg-background px-3 py-2.5 flex items-center gap-2">
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="p-2 rounded-full hover:bg-muted text-muted-foreground"><Paperclip className="w-5 h-5" /></button>
        <input ref={fileRef} type="file" hidden onChange={handleFile} />
        <input
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendText(); }}
          placeholder="Message..."
          className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        {text.trim() ? (
          <button onClick={sendText} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Send className="w-5 h-5" /></button>
        ) : (
          <button
            onMouseDown={startRec} onMouseUp={stopRec} onMouseLeave={() => recording && stopRec()}
            onTouchStart={startRec} onTouchEnd={stopRec}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${recording ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-primary text-primary-foreground"}`}
            aria-label="Hold to record"
          ><Mic className="w-5 h-5" /></button>
        )}
      </div>
    </div>
  );
}
