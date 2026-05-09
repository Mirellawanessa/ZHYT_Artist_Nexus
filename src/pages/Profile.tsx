import { useState, useEffect, useCallback } from "react";
import { Bell, ChevronLeft, ChevronRight, Play, SkipBack, SkipForward, AlertCircle, Pencil, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { HeartIcon, SquigglyLineBottom, SquigglyLineTop, SparkBurst } from "@/components/profile/DecorativeSVGs";
import nexieLogo from "@/assets/nexie-logo.png";
import weekPhoto1 from "@/assets/week/photo1.jpg";
import weekPhoto2 from "@/assets/week/photo2.jpg";
import weekPhoto3 from "@/assets/week/photo3.png";
import weekPhoto4 from "@/assets/week/photo4.jpg";
import weekPhoto5 from "@/assets/week/photo5.png";
import weekPhoto6 from "@/assets/week/photo6.jpg";
import weekPhoto7 from "@/assets/week/photo7.png";
import weekPhoto8 from "@/assets/week/photo8.png";
import weekPhoto9 from "@/assets/week/photo9.png";
import weekPhoto10 from "@/assets/week/photo10.png";

const weekPhotos = [weekPhoto1, weekPhoto2, weekPhoto3, weekPhoto4, weekPhoto5, weekPhoto6, weekPhoto7, weekPhoto8, weekPhoto9, weekPhoto10];

const mockFriends = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=20",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=47",
];

const mockGallery = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
];

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState("Soo-min | 류수민");
  const [bio, setBio] = useState("Curious by nature, an artist at heart. 🎨");
  const [avatarUrl, setAvatarUrl] = useState<string | null>("https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const [editNameValue, setEditNameValue] = useState(displayName);
  const [editBioValue, setEditBioValue] = useState(bio);

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("display_name, bio, avatar_url")
      .eq("user_id", user.id)
      .single();

    if (data) {
      if (data.display_name && data.display_name !== "User") {
        setDisplayName(data.display_name);
        setEditNameValue(data.display_name);
      }
      if (data.bio) {
        setBio(data.bio);
        setEditBioValue(data.bio);
      }
      if (data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user, fetchProfile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(path);
      const { error: dbError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
      if (dbError) {
        toast({ title: "Error saving photo", variant: "destructive" });
      } else {
        setAvatarUrl(publicUrl);
        toast({ title: "Profile photo updated successfully!" });
      }
    } else {
      toast({ title: "Error uploading photo", variant: "destructive" });
    }
    setUploadingAvatar(false);
  };

  const saveName = async () => {
    if (!editNameValue.trim() || !user) return;
    const { error } = await supabase.from("profiles").update({ display_name: editNameValue.trim() }).eq("user_id", user.id);
    if (error) {
      toast({ title: "Error saving name", variant: "destructive" });
    } else {
      setDisplayName(editNameValue.trim());
      setIsEditingName(false);
      toast({ title: "Name saved!" });
    }
  };

  const saveBio = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ bio: editBioValue.trim() }).eq("user_id", user.id);
    if (error) {
      toast({ title: "Error saving biography", variant: "destructive" });
    } else {
      setBio(editBioValue.trim());
      setIsEditingBio(false);
      toast({ title: "Biography saved!" });
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-[#ebebeb] font-serif selection:bg-black selection:text-white overflow-x-auto">
      <div className="w-full min-w-[1350px] min-h-[950px] max-w-[1600px] mx-auto relative p-8">
        
        {/* Decorative SVGs */}
        <SquigglyLineTop className="absolute top-[100px] left-[650px] w-64 h-32 opacity-80" />
        <SquigglyLineBottom className="absolute bottom-[200px] right-[400px] w-32 h-16 opacity-80" />
        <SparkBurst className="absolute top-[500px] right-[150px] w-16 h-16 opacity-80" />

        {/* Top Left Profile Card */}
        <div className="absolute top-8 left-8 bg-[#e0e0e0] rounded-[2.5rem] p-8 w-[600px] h-[380px] flex shadow-sm z-10">
          {/* Avatar */}
          <div className="relative w-[200px] h-[240px] rounded-3xl border-4 border-white shrink-0 shadow-md bg-white group">
            <HeartIcon className="absolute -top-10 -right-8 w-16 h-16 opacity-90 -rotate-12 z-20 pointer-events-none" />
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <img src={avatarUrl || ""} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white font-semibold text-sm">{uploadingAvatar ? "Uploading..." : "Change Photo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
            </label>
          </div>

          {/* Info */}
          <div className="ml-8 mt-2 flex flex-col w-full">
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-2">
                <input 
                  autoFocus 
                  value={editNameValue} 
                  onChange={(e) => setEditNameValue(e.target.value)} 
                  onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") { setEditNameValue(displayName); setIsEditingName(false); } }}
                  className="text-3xl font-bold text-[#2a2a2a] font-serif bg-transparent border-b-2 border-[#2a2a2a] focus:outline-none w-full"
                />
                <button onClick={saveName}><Check className="w-5 h-5 text-green-600" /></button>
                <button onClick={() => { setEditNameValue(displayName); setIsEditingName(false); }}><X className="w-5 h-5 text-red-600" /></button>
              </div>
            ) : (
              <h1 className="text-4xl font-bold text-[#2a2a2a] mb-2 font-serif group flex items-center gap-3">
                {displayName}
                <Pencil className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" onClick={() => setIsEditingName(true)} />
              </h1>
            )}

            {isEditingBio ? (
              <div className="mb-6 flex flex-col items-end gap-2 w-full max-w-[280px]">
                <textarea 
                  autoFocus 
                  value={editBioValue} 
                  onChange={(e) => setEditBioValue(e.target.value)}
                  className="text-sm font-medium italic text-[#4a4a4a] font-sans bg-transparent border border-gray-400 rounded p-2 w-full focus:outline-none resize-none h-20"
                />
                <div className="flex gap-2">
                  <button onClick={saveBio} className="bg-green-600 text-white rounded px-2 py-1 flex items-center justify-center"><Check className="w-3 h-3" /></button>
                  <button onClick={() => { setEditBioValue(bio); setIsEditingBio(false); }} className="bg-red-600 text-white rounded px-2 py-1 flex items-center justify-center"><X className="w-3 h-3" /></button>
                </div>
              </div>
            ) : (
              <div className="mb-6 group flex items-start gap-2 max-w-[280px]">
                <p className="text-sm font-medium italic text-[#4a4a4a] font-sans">
                  {bio}
                </p>
                <Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity shrink-0 mt-1" onClick={() => setIsEditingBio(true)} />
              </div>
            )}

            <p className="text-sm text-[#3a3a3a] leading-relaxed mb-8 max-w-[280px] font-sans">
              Always learning, always creating. My energy comes from the people I surround myself with. I value honesty, trust, and a good balance between social connection and recharge time. Blue, black, and white that's me. Let's keep growing together.
            </p>
            
            <div className="flex items-start gap-4">
              <img src={nexieLogo} alt="N-EXIE logo" className="w-8 h-8 object-contain" />
              <div className="text-xs text-[#2a2a2a] font-sans space-y-1">
                <p><span className="font-bold">Program:</span> AI-Operated Human Artist</p>
                <p><span className="font-bold">Division:</span> N-EXIE Creators</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Notification Pill */}
        <div className="absolute top-8 right-8 bg-black text-white rounded-full py-4 px-6 flex items-center gap-6 z-10 shadow-lg pr-12 cursor-pointer hover:bg-gray-900 transition-colors">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6 text-black" />
          </div>
          <div>
            <p className="font-bold font-serif text-lg mb-1">Welcome back!</p>
            <p className="text-xs italic text-gray-300 font-sans">Do you want to see your notifications?</p>
          </div>
          <ChevronRight className="absolute right-6 w-5 h-5 text-gray-400" />
        </div>

        {/* For this week (Middle Right) */}
        <div className="absolute top-[200px] right-8 z-10">
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-2xl font-bold font-serif text-[#1a1a1a]">For this week</h2>
            <button className="bg-[#dcdcdc] px-4 py-1.5 rounded-full text-sm font-semibold text-[#1a1a1a] hover:bg-gray-300 transition-colors font-sans ml-12">
              view all
            </button>
          </div>
          <div className="flex items-center gap-4">
            <ChevronLeft className="w-6 h-6 text-[#1a1a1a] cursor-pointer" />
            {mockGallery.map((img, i) => (
              <div key={i} className="w-[120px] h-[150px] rounded-2xl overflow-hidden shadow-md">
                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
            <ChevronRight className="w-6 h-6 text-[#1a1a1a] cursor-pointer" />
          </div>
        </div>

        {/* Friends (Center Left) */}
        <div className="absolute top-[440px] left-8 z-10">
          <h2 className="text-xl font-bold font-serif text-[#1a1a1a] mb-4">Friends</h2>
          {/* Decorative squiggly line above friends */}
          <svg viewBox="0 0 100 50" fill="none" className="absolute -top-12 -left-8 w-24 h-12">
            <path d="M0 40 C 20 10, 40 40, 60 10 C 80 40, 100 10, 100 40" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
          </svg>
          <div className="flex items-center">
            {mockFriends.map((friend, i) => (
              <img 
                key={i} 
                src={friend} 
                alt={`Friend ${i}`} 
                className={`w-14 h-14 rounded-full border-4 border-[#ebebeb] object-cover shadow-sm ${i > 0 ? '-ml-4' : ''}`}
              />
            ))}
            <span className="ml-4 font-bold text-2xl tracking-widest text-[#1a1a1a]">...</span>
          </div>
        </div>

        {/* View your files (Bottom Left) */}
        <div className="absolute top-[580px] left-8 z-10 w-[350px]">
          <div className="flex items-center gap-2 mb-8 ml-2">
            <h2 className="text-xl font-serif italic text-[#1a1a1a]">View your files</h2>
            <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
              <AlertCircle className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="relative pl-8">
            {/* Vertical connection line */}
            <div className="absolute left-4 top-4 bottom-8 w-0.5 bg-[#1a1a1a]"></div>

            {/* Folder icon origin */}
            <div className="absolute left-0 top-0 w-8 h-8 bg-[#f5f5f5] rounded-lg border-2 border-[#1a1a1a] flex items-center justify-center shadow-sm z-10">
              <div className="w-2 h-0.5 bg-[#1a1a1a] rounded-full mr-1"></div>
              <div className="w-2 h-0.5 bg-[#1a1a1a] rounded-full"></div>
            </div>

            <div className="space-y-6 pt-4">
              {[
                { label: "Contracts & Documents", path: "/contracts" },
                { label: "File Vault", path: "#" },
                { label: "Career Strategy", path: "#" },
                { label: "AI Persona Development", path: "#" }
              ].map((item, i) => (
                <div key={i} className="relative flex items-center group cursor-pointer" onClick={() => item.path !== "#" && navigate(item.path)}>
                  {/* Horizontal branch line */}
                  <div className="absolute -left-4 w-4 h-0.5 bg-[#1a1a1a]"></div>
                  <div className="bg-white rounded-full py-3 px-8 shadow-sm w-full font-serif font-bold text-[#1a1a1a] text-center group-hover:bg-gray-50 transition-colors border border-transparent group-hover:border-gray-200">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audio Player / Center Media (Bottom Center) */}
        <div className="absolute top-[600px] left-[550px] z-10">
          <div className="relative">
            <div className="w-[400px] h-[250px] rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-200">
              <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Band" className="w-full h-full object-cover" />
            </div>
            
            {/* Controls pill */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#2a2a2a] rounded-full py-3 px-8 w-[80%] flex items-center justify-between shadow-lg">
              <SkipBack className="w-5 h-5 text-white cursor-pointer" />
              <div className="flex flex-col items-center">
                <span className="text-white text-xs font-bold tracking-widest font-sans mb-1">CHAOS</span>
                <div className="w-20 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-white rounded-full"></div>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center cursor-pointer">
                <Play className="w-3 h-3 text-white ml-0.5" />
              </div>
              <SkipForward className="w-5 h-5 text-white cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Jobs Available (Bottom Right) */}
        <div className="absolute top-[520px] right-8 z-10 w-[300px]">
          
          <div className="relative">
            {/* Avatar connected to card */}
            <div className="absolute -left-12 top-4">
              <img src="https://i.pravatar.cc/150?img=60" alt="Job origin" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
              {/* Connection line */}
              <svg viewBox="0 0 50 100" fill="none" className="absolute top-4 left-4 w-12 h-24 -z-10">
                <path d="M0 0 V 80 H 50" stroke="#1a1a1a" strokeWidth="1" fill="none" />
              </svg>
            </div>

            <div className="bg-[#b4b4b4] rounded-[2rem] p-6 shadow-md relative pt-12">
              {/* Pill top center */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white rounded-full py-2 px-6 shadow-sm border border-gray-100">
                <span className="text-xs font-bold font-sans text-[#1a1a1a]">Jobs available:</span>
              </div>

              <div className="bg-[#cdcdcd] rounded-2xl p-5 mb-4 opacity-90 relative">
                <p className="text-xs text-white font-bold tracking-wider mb-2 font-sans">FIRST OFFICIAL TASK</p>
                <p className="text-sm text-white font-serif italic mb-4">A.X.S — Artist Development Mission 001</p>
                <p className="text-xs text-white font-sans opacity-80">Define Your Identity. Build Your Presence.</p>
                
                {/* Next arrow circle */}
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center cursor-pointer">
                  <ChevronRight className="w-4 h-4 text-[#1a1a1a]" />
                </div>
              </div>

              <div className="bg-white rounded-full py-3 px-6 shadow-sm flex items-center justify-between border border-gray-100">
                <p className="text-xs font-serif italic text-[#1a1a1a] pr-4 leading-tight">This is where your identity becomes power.</p>
                <div className="w-4 h-4 bg-black rounded-full shrink-0"></div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Profile;
