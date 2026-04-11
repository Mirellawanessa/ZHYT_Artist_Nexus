import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditableNameProps {
  name: string;
  userId: string;
  onNameChange: (name: string) => void;
}

export const EditableName = ({ name, userId, onNameChange }: EditableNameProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const { toast } = useToast();

  const save = async () => {
    if (!value.trim()) return;
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: value.trim() })
      .eq("user_id", userId);

    if (error) {
      toast({ title: "Error saving name", variant: "destructive" });
    } else {
      onNameChange(value.trim());
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setValue(name); setEditing(false); } }}
          className="text-2xl font-semibold text-foreground bg-transparent border-b-2 border-foreground/30 focus:outline-none focus:border-foreground w-48"
        />
        <button onClick={save}><Check className="h-4 w-4 text-foreground" /></button>
        <button onClick={() => { setValue(name); setEditing(false); }}><X className="h-4 w-4 text-muted-foreground" /></button>
      </div>
    );
  }

  return (
    <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
      {name}
      <Pencil className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => setEditing(true)} />
    </h1>
  );
};
