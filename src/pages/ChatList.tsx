import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AppShell from "@/components/layout/AppShell";

interface ConvRow {
  id: string;
  last_message_at: string;
  last_message_preview: string | null;
  other: { user_id: string; display_name: string; avatar_url: string | null } | null;
}

export default function ChatList() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<ConvRow[]>([]);
  const [allUsers, setAllUsers] = useState<{ user_id: string; display_name: string; avatar_url: string | null }[]>([]);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { if (!loading && !user) navigate("/"); }, [user, loading, navigate]);

  const load = async () => {
    if (!user) return;
    // get my participations
    const { data: parts } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);
    const convIds = (parts ?? []).map((p) => p.conversation_id);
    if (!convIds.length) { setItems([]); return; }
    const { data: convs } = await supabase
      .from("conversations")
      .select("*")
      .in("id", convIds)
      .order("last_message_at", { ascending: false });
    const { data: others } = await supabase
      .from("conversation_participants")
      .select("conversation_id, user_id")
      .in("conversation_id", convIds)
      .neq("user_id", user.id);
    const otherIds = Array.from(new Set((others ?? []).map((o) => o.user_id)));
    const { data: profs } = otherIds.length
      ? await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", otherIds)
      : { data: [] as any[] };
    const profMap = new Map<string, any>((profs ?? []).map((p: any) => [p.user_id, p]));
    const otherMap = new Map<string, string>();
    (others ?? []).forEach((o) => otherMap.set(o.conversation_id, o.user_id));
    setItems((convs ?? []).map((c) => ({
      id: c.id,
      last_message_at: c.last_message_at,
      last_message_preview: c.last_message_preview,
      other: profMap.get(otherMap.get(c.id) ?? "") ?? null,
    })));
  };

  useEffect(() => {
    if (!user) return;
    load();
    supabase.from("profiles").select("user_id, display_name, avatar_url").neq("user_id", user.id).then(({ data }) => setAllUsers(data ?? []));
    const ch = supabase.channel("chat_list_" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => load())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const startChat = async (otherId: string) => {
    const { data, error } = await supabase.rpc("get_or_create_direct_conversation", { _other: otherId });
    if (error) return;
    navigate(`/chat/${data}`);
  };

  const filtered = items.filter((i) => !search || i.other?.display_name.toLowerCase().includes(search.toLowerCase()));

  if (loading || !user) return null;

  return (
    <AppShell>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 pt-6 pb-4">
          <h1 className="text-3xl font-serif font-bold">Chat</h1>
          <button onClick={() => setShowNew((v) => !v)} className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center" aria-label="New chat">
            <Pencil className="w-5 h-5" />
          </button>
        </header>

        <div className="px-6 pb-3">
          <div className="flex items-center gap-2 bg-muted rounded-full px-4 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for chats & messages"
              className="bg-transparent text-sm flex-1 outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {showNew && (
          <div className="px-6 pb-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Start a new conversation</p>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border max-h-64 overflow-auto">
              {allUsers.map((u) => (
                <button key={u.user_id} onClick={() => { setShowNew(false); startChat(u.user_id); }} className="w-full flex items-center gap-3 p-3 hover:bg-muted text-left">
                  {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-muted" />}
                  <span className="text-sm font-medium">{u.display_name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <ul className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <li className="text-center text-sm text-muted-foreground py-12 px-6">
              No conversations yet. Tap the pencil to start one.
            </li>
          )}
          {filtered.map((c) => (
            <li key={c.id}>
              <button onClick={() => navigate(`/chat/${c.id}`)} className="w-full flex items-center gap-3 px-6 py-3 hover:bg-muted/50 text-left">
                {c.other?.avatar_url ? (
                  <img src={c.other.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{c.other?.display_name ?? "Unknown"}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.last_message_preview ?? "No messages yet"}</p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {new Date(c.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
