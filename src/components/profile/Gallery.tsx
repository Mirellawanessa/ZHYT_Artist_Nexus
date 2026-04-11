import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Image, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  storage_path: string;
  file_name: string;
  url: string;
}

interface GalleryProps {
  photos: Photo[];
  userId: string;
  onPhotosChange: () => void;
}

export const Gallery = ({ photos, userId, onPhotosChange }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const prev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  const next = () => setCurrentIndex((i) => (i < photos.length - 1 ? i + 1 : 0));

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("gallery_photos").insert({
      user_id: userId,
      storage_path: path,
      file_name: file.name,
    });

    if (dbError) {
      toast({ title: "Error saving photo", variant: "destructive" });
    } else {
      onPhotosChange();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = async (photo: Photo) => {
    await supabase.storage.from("gallery").remove([photo.storage_path]);
    await supabase.from("gallery_photos").delete().eq("id", photo.id);
    if (currentIndex >= photos.length - 1 && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    onPhotosChange();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">My gallery</h2>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="h-4 w-4" />
          {uploading ? "Uploading..." : "Add photo"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
      </div>

      <div className="relative flex items-center">
        {photos.length > 1 && (
          <button onClick={prev} className="absolute -left-4 z-10 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        <div
          className="w-full aspect-[4/3] rounded-lg flex items-center justify-center overflow-hidden relative"
          style={{ backgroundColor: "hsl(220, 30%, 92%)", border: "4px solid hsl(220, 30%, 88%)" }}
        >
          {photos.length > 0 ? (
            <>
              <img
                src={photos[currentIndex]?.url}
                alt={photos[currentIndex]?.file_name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => remove(photos[currentIndex])}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Image className="h-8 w-8" />
              <span className="text-sm">Click "Add photo" to start</span>
            </div>
          )}
        </div>

        {photos.length > 1 && (
          <button onClick={next} className="absolute -right-4 z-10 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? "bg-foreground" : "bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
