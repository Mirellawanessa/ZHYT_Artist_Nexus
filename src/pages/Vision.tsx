import AppShell from "@/components/layout/AppShell";

export default function Vision() {
  return (
    <AppShell>
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-serif font-bold">Vision &amp; Goals</h1>
        <p className="text-sm text-muted-foreground mt-1">Your roadmap with N-EXIE Entertainment.</p>
      </header>
      <div className="px-6 space-y-4">
        {[
          { t: "Q1 — Foundation", d: "Brand identity, AI persona training, debut singles." },
          { t: "Q2 — Launch", d: "Mini-album rollout, first international showcase." },
          { t: "Q3 — Expansion", d: "Collaborations, fanbase growth campaigns." },
          { t: "Q4 — Legacy", d: "World tour planning, full studio album." },
        ].map((g) => (
          <div key={g.t} className="rounded-2xl border border-border p-4">
            <p className="font-semibold">{g.t}</p>
            <p className="text-sm text-muted-foreground mt-1">{g.d}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
