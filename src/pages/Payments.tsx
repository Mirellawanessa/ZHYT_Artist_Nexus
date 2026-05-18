import AppShell from "@/components/layout/AppShell";

export default function Payments() {
  return (
    <AppShell>
      <header className="flex items-center gap-3 px-6 pt-6 pb-6">
        <span className="text-2xl font-serif font-bold tracking-tight">Z</span>
        <h1 className="text-2xl font-serif font-bold">Payments</h1>
      </header>
      <div className="px-6 space-y-5">
        <div className="rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground mb-1">Current balance</p>
          <p className="text-3xl font-bold tracking-tight">$00.00</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="bg-muted px-2 py-1 rounded">PP</span>
          <span>mail@gmail.com</span>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <p className="text-xs text-muted-foreground mb-4">Earnings (12 months)</p>
          <svg viewBox="0 0 320 120" className="w-full h-32">
            <polyline points="0,90 40,88 80,85 120,82 160,78 200,72 240,60 280,45 320,30"
              fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" />
            <text x="0" y="20" fontSize="10" fill="hsl(var(--muted-foreground))">$4</text>
            <text x="0" y="50" fontSize="10" fill="hsl(var(--muted-foreground))">$3</text>
            <text x="0" y="80" fontSize="10" fill="hsl(var(--muted-foreground))">$1</text>
            <text x="0" y="115" fontSize="10" fill="hsl(var(--muted-foreground))">$0</text>
          </svg>
        </div>
      </div>
    </AppShell>
  );
}
