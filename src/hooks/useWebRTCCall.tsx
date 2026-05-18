import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CallKind = "audio" | "video";
export type CallState = "idle" | "ringing" | "outgoing" | "connecting" | "connected" | "ended";

interface UseCallOptions {
  userId: string | undefined;
}

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function useWebRTCCall({ userId }: UseCallOptions) {
  const [state, setState] = useState<CallState>("idle");
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [callKind, setCallKind] = useState<CallKind>("audio");
  const [incoming, setIncoming] = useState<{ from: string; conv: string; kind: CallKind; offer: RTCSessionDescriptionInit } | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const cleanup = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    pendingIceRef.current = [];
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
  }, []);

  const endCall = useCallback(async () => {
    if (conversationId && remoteUserId && userId) {
      await supabase.from("call_signals").insert({
        conversation_id: conversationId,
        from_user: userId,
        to_user: remoteUserId,
        signal_type: "hangup",
      });
    }
    cleanup();
    setState("idle");
    setRemoteUserId(null);
    setConversationId(null);
    setIncoming(null);
  }, [conversationId, remoteUserId, userId, cleanup]);

  const createPeer = useCallback((convId: string, otherId: string) => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;
    const remote = new MediaStream();
    remoteStreamRef.current = remote;

    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => remote.addTrack(t));
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remote;
    };
    pc.onicecandidate = (e) => {
      if (e.candidate && userId) {
        supabase.from("call_signals").insert({
          conversation_id: convId,
          from_user: userId,
          to_user: otherId,
          signal_type: "ice",
          payload: e.candidate.toJSON() as any,
        });
      }
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") setState("connected");
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") endCall();
    };
    return pc;
  }, [userId, endCall]);

  const getLocalMedia = useCallback(async (kind: CallKind) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: kind === "video",
    });
    localStreamRef.current = stream;
    if (localVideoRef.current && kind === "video") localVideoRef.current.srcObject = stream;
    return stream;
  }, []);

  const startCall = useCallback(async (otherUserId: string, convId: string, kind: CallKind) => {
    if (!userId) return;
    setRemoteUserId(otherUserId);
    setConversationId(convId);
    setCallKind(kind);
    setState("outgoing");
    const stream = await getLocalMedia(kind);
    const pc = createPeer(convId, otherUserId);
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    await supabase.from("call_signals").insert({
      conversation_id: convId,
      from_user: userId,
      to_user: otherUserId,
      signal_type: "ring",
      call_kind: kind,
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await supabase.from("call_signals").insert({
      conversation_id: convId,
      from_user: userId,
      to_user: otherUserId,
      signal_type: "offer",
      call_kind: kind,
      payload: offer as any,
    });
  }, [userId, getLocalMedia, createPeer]);

  const acceptIncoming = useCallback(async () => {
    if (!incoming || !userId) return;
    setRemoteUserId(incoming.from);
    setConversationId(incoming.conv);
    setCallKind(incoming.kind);
    setState("connecting");
    const stream = await getLocalMedia(incoming.kind);
    const pc = createPeer(incoming.conv, incoming.from);
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    await pc.setRemoteDescription(new RTCSessionDescription(incoming.offer));
    for (const c of pendingIceRef.current) {
      try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
    }
    pendingIceRef.current = [];
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await supabase.from("call_signals").insert({
      conversation_id: incoming.conv,
      from_user: userId,
      to_user: incoming.from,
      signal_type: "answer",
      payload: answer as any,
    });
    setIncoming(null);
  }, [incoming, userId, getLocalMedia, createPeer]);

  const rejectIncoming = useCallback(async () => {
    if (!incoming || !userId) return;
    await supabase.from("call_signals").insert({
      conversation_id: incoming.conv,
      from_user: userId,
      to_user: incoming.from,
      signal_type: "hangup",
    });
    setIncoming(null);
  }, [incoming, userId]);

  // listen for incoming signals
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`call_signals_${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "call_signals", filter: `to_user=eq.${userId}` },
        async (payload) => {
          const sig: any = payload.new;
          if (sig.signal_type === "ring") {
            // pre-notify; offer arrives next
          } else if (sig.signal_type === "offer") {
            setIncoming({ from: sig.from_user, conv: sig.conversation_id, kind: sig.call_kind, offer: sig.payload });
            setState("ringing");
          } else if (sig.signal_type === "answer") {
            try {
              await pcRef.current?.setRemoteDescription(new RTCSessionDescription(sig.payload));
              for (const c of pendingIceRef.current) {
                try { await pcRef.current?.addIceCandidate(new RTCIceCandidate(c)); } catch {}
              }
              pendingIceRef.current = [];
              setState("connecting");
            } catch (e) { console.error("answer error", e); }
          } else if (sig.signal_type === "ice") {
            if (pcRef.current?.remoteDescription) {
              try { await pcRef.current.addIceCandidate(new RTCIceCandidate(sig.payload)); } catch {}
            } else {
              pendingIceRef.current.push(sig.payload);
            }
          } else if (sig.signal_type === "hangup") {
            cleanup();
            setState("idle");
            setIncoming(null);
            setRemoteUserId(null);
            setConversationId(null);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, cleanup]);

  return {
    state, callKind, remoteUserId, conversationId, incoming,
    startCall, acceptIncoming, rejectIncoming, endCall,
    localVideoRef, remoteVideoRef, remoteAudioRef,
  };
}
