import { useEffect, useState } from "react";
import { Phone, PhoneOff, Video, Mic, MicOff, VideoOff } from "lucide-react";
import { useCall } from "./CallProvider";
import { supabase } from "@/integrations/supabase/client";

export default function IncomingCallListener() {
  const { state, callKind, incoming, acceptIncoming, rejectIncoming, endCall, localVideoRef, remoteVideoRef, remoteAudioRef, remoteUserId } = useCall();
  const [remoteName, setRemoteName] = useState<string>("");
  const [remoteAvatar, setRemoteAvatar] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  useEffect(() => {
    const otherId = incoming?.from ?? remoteUserId;
    if (!otherId) { setRemoteName(""); setRemoteAvatar(null); return; }
    supabase.from("profiles").select("display_name, avatar_url").eq("user_id", otherId).maybeSingle().then(({ data }) => {
      if (data) { setRemoteName(data.display_name); setRemoteAvatar(data.avatar_url); }
    });
  }, [incoming, remoteUserId]);

  const toggleMute = () => {
    const stream = (localVideoRef.current?.srcObject as MediaStream | null);
    stream?.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted(!muted);
  };
  const toggleCam = () => {
    const stream = (localVideoRef.current?.srcObject as MediaStream | null);
    stream?.getVideoTracks().forEach((t) => (t.enabled = camOff));
    setCamOff(!camOff);
  };

  if (state === "idle" && !incoming) return null;

  // Incoming ring overlay
  if (state === "ringing" && incoming) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col items-center justify-center px-8 animate-in fade-in">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Incoming {incoming.kind}</p>
        {remoteAvatar && <img src={remoteAvatar} alt={remoteName} className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-primary/30 animate-pulse" />}
        <h2 className="text-2xl font-serif font-bold mb-12">{remoteName || "Unknown"}</h2>
        <div className="flex items-center gap-12">
          <button onClick={rejectIncoming} className="w-16 h-16 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg active:scale-95 transition">
            <PhoneOff className="w-7 h-7" />
          </button>
          <button onClick={acceptIncoming} className="w-16 h-16 rounded-full bg-success text-success-foreground flex items-center justify-center shadow-lg active:scale-95 transition">
            {incoming.kind === "video" ? <Video className="w-7 h-7" /> : <Phone className="w-7 h-7" />}
          </button>
        </div>
      </div>
    );
  }

  // In-call overlay
  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
      {callKind === "video" ? (
        <div className="flex-1 relative">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover bg-black" />
          <video ref={localVideoRef} autoPlay playsInline muted className="absolute top-4 right-4 w-32 h-44 rounded-xl object-cover ring-2 ring-white/30" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          {remoteAvatar && <img src={remoteAvatar} alt={remoteName} className="w-40 h-40 rounded-full object-cover mb-6 ring-4 ring-primary/40" />}
          <h2 className="text-3xl font-serif font-bold">{remoteName}</h2>
          <p className="text-muted-foreground mt-2 capitalize">{state === "connected" ? "Connected" : state}</p>
          <audio ref={remoteAudioRef} autoPlay />
        </div>
      )}
      <div className="flex items-center justify-center gap-6 pb-10 pt-6 bg-gradient-to-t from-black/80 to-transparent">
        <button onClick={toggleMute} className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        {callKind === "video" && (
          <button onClick={toggleCam} className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
            {camOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        )}
        <button onClick={endCall} className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center shadow-lg">
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
