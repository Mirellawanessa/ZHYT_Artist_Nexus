import { useState, useEffect, useCallback } from "react";
import { Settings, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EditableName } from "@/components/profile/EditableName";
import { Gallery } from "@/components/profile/Gallery";
import { CalendarWidget } from "@/components/profile/CalendarWidget";
import { FlipClock } from "@/components/profile/FlipClock";

const accessItems = [
  { emoji: "🏰", label: "Command Center" },
  { emoji: "📁", label: "Contracts & Documents" },
  { emoji: "📂", label: "File Vault" },
  { emoji: "📊", label: "Career Strategy" },
  { emoji: "🤖", label: "AI Persona Development" },
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
    }
  }, [user, fetchProfile, fetchPhotos, fetchEvents]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <FlipClock />
          <div>
            <div className="rounded-t-lg px-4 py-3" style={{ backgroundColor: "hsl(220, 30%, 90%)" }}>
              <h2 className="text-2xl font-bold text-foreground">Accesses</h2>
            </div>
            <div className="space-y-3 mt-4">
              {accessItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-foreground cursor-pointer hover:opacity-70 transition-opacity">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <Gallery photos={photos} userId={user.id} onPhotosChange={fetchPhotos} />
          <CalendarWidget events={events} userId={user.id} onEventsChange={fetchEvents} />
        </div>
      </div>

      {/* Chat FAB */}
      <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Profile;
