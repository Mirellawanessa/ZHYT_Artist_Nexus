import AppShell from "@/components/layout/AppShell";
import { useNavigate } from "react-router-dom";

const sections = [
  { label: "For This Week", path: "/profile" },
  { label: "A.X.S Internal", path: "/axs" },
  { label: "Contracts & Documents", path: "/contracts" },
  { label: "Confidential Files", path: "/axs" },
  { label: "Vision & Goals", path: "/vision" },
  { label: "Apex Girl's Guide", path: "/vision" },
];

export default function Home() {
  const nav = useNavigate();
  return (
    <AppShell>
      <div className="flex flex-1">
        <aside className="w-12 bg-primary-soft flex items-center justify-center">
          <p className="text-[11px] text-primary font-serif italic [writing-mode:vertical-rl] rotate-180 tracking-wide">
            Where Stars Connect and Legends Begin.
          </p>
        </aside>
        <div className="flex-1 px-6 py-8">
          <ul className="space-y-4">
            {sections.map((s) => (
              <li key={s.label} className="flex items-baseline gap-2">
                <span className="text-primary">•</span>
                <button onClick={() => nav(s.path)} className="text-lg font-medium text-left hover:text-primary transition-colors">
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
