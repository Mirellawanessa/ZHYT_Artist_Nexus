import AppShell from "@/components/layout/AppShell";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useState } from "react";

const songs = [
  { n: "01", t: "Intro" },
  { n: "02", t: "Close Like This" },
  { n: "03", t: "카오스 (Chaos)" },
  { n: "04", t: "Paradox" },
  { n: "05", t: "Paradox" },
  { n: "06", t: "Stay" },
  { n: "07", t: "A.X.S" },
];

export default function Axs() {
  const [tab, setTab] = useState<"album" | "ai" | "files">("album");
  const [playing, setPlaying] = useState(false);
  return (
    <AppShell>
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-serif font-bold">Songs</h1>
        <div className="flex items-center gap-2 mt-3 text-xs">
          {[
            { k: "album", l: "A.X.S Album" },
            { k: "ai", l: "AI Persona" },
            { k: "files", l: "Music Files" },
          ].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k as any)}
              className={`px-3 py-1 rounded-full ${tab === t.k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {t.l}
            </button>
          ))}
        </div>
      </header>

      <div className="px-6 mb-4 flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-foreground text-background flex items-center justify-center">
          <span className="text-2xl">♪</span>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">A.X.S Album</p>
          <p className="text-sm font-semibold">AI Persona — Week 1</p>
          <p className="text-[11px] text-muted-foreground">Welcome to ZHYT NEXIE</p>
        </div>
      </div>

      <div className="px-6 flex items-center justify-center gap-6 py-3 mb-4">
        <button className="text-muted-foreground"><SkipBack className="w-5 h-5" /></button>
        <button onClick={() => setPlaying((p) => !p)} className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center">
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button className="text-muted-foreground"><SkipForward className="w-5 h-5" /></button>
      </div>

      <ul className="px-4 space-y-1.5 pb-4">
        {songs.map((s) => (
          <li key={s.n} className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3">
            <span className="text-xs text-muted-foreground w-6">{s.n}.</span>
            <span className="text-foreground/70">♪</span>
            <span className="text-sm">{s.t}</span>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
