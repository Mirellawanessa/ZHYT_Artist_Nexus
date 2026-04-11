import { useState, useEffect, useCallback } from "react";
import { Settings, MessageCircle, FileText, Folder, TrendingUp, Bot, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EditableName } from "@/components/profile/EditableName";
import { Gallery } from "@/components/profile/Gallery";
import { CalendarWidget } from "@/components/profile/CalendarWidget";
import { FlipClock } from "@/components/profile/FlipClock";

const accessItems = [
  { icon: FileText, label: "Contracts & Documents" },
  { icon: Folder, label: "File Vault" },
  { icon: TrendingUp, label: "Career Strategy" },
  { icon: Bot, label: "AI Persona Development" },
];

interface Photo {
  id: string;
  storage_path: string;
  file_name: string;
  url: string;
}

interface CalendarEvent {
  id: string;
  event_date: string;
  title: string;
  description: string | null;
  color: string;
}

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("User");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single();
    if (data) setDisplayName(data.display_name);
  }, [user]);

  const fetchPhotos = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (data) {
      const withUrls = data.map((p) => ({
        ...p,
        url: supabase.storage.from("gallery").getPublicUrl(p.storage_path).data.publicUrl,
      }));
      setPhotos(withUrls);
    }
  }, [user]);

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", user.id)
      .order("event_date", { ascending: true });
    if (data) setEvents(data);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPhotos();
      fetchEvents();
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [user, fetchProfile, fetchPhotos, fetchEvents]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(path);
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      setAvatarUrl(publicUrl);
    }
    setUploadingAvatar(false);
  };

  const handleAvatarRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    setUploadingAvatar(true);
    await supabase.auth.updateUser({ data: { avatar_url: null } });
    setAvatarUrl(null);
    setUploadingAvatar(false);
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <label className="relative cursor-pointer w-14 h-14 rounded-full overflow-hidden bg-muted group flex items-center justify-center">
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-semibold">{uploadingAvatar ? "..." : "Edit"}</span>
              </div>
            </label>
            {avatarUrl && (
              <button
                onClick={handleAvatarRemove}
                disabled={uploadingAvatar}
                className="absolute -top-1 -right-1 w-5 h-5 bg-background shadow-sm border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-colors z-10"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <EditableName name={displayName} userId={user.id} onNameChange={setDisplayName} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground">Sign out</button>
          <Settings className="h-6 w-6 text-muted-foreground cursor-pointer" />
        </div>
      </div>

      {/* Info */}
      <div className="mb-8">
        <p className="text-foreground"><span className="font-bold">Program:</span> AI-Operated Human Artist</p>
        <p className="text-foreground"><span className="font-bold">Division:</span> N-EXIE Creators</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Clock & Accesses */}
        <div className="space-y-6">
          <FlipClock />
          <div className="border border-border/50 rounded-lg overflow-hidden shadow-sm bg-card max-w-sm">
            <div className="bg-muted/30 px-3 py-2 border-b border-border/50">
              <h2 className="text-sm font-semibold text-foreground">Accesses</h2>
            </div>
            <div className="p-2 space-y-1">
              {accessItems.map((item) => (
                <div 
                  key={item.label} 
                  onClick={() => {
                    if (item.label === "Contracts & Documents") navigate("/contracts");
                  }}
                  className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer hover:bg-muted/50 px-2 py-1.5 rounded-md transition-colors"
                >
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Gallery */}
        <div className="space-y-8">
          <Gallery photos={photos} userId={user.id} onPhotosChange={fetchPhotos} />
        </div>
      </div>

      {/* Bottom Section - Calendar */}
      <div className="w-full">
        <CalendarWidget events={events} userId={user.id} onEventsChange={fetchEvents} />
      </div>

      {/* Chat FAB */}
      <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Profile;
