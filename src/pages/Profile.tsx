import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Settings, Pencil, Image, MessageCircle } from "lucide-react";

const accessItems = [
  { emoji: "🏰", label: "Command Center" },
  { emoji: "📁", label: "Contracts & Documents" },
  { emoji: "📂", label: "File Vault" },
  { emoji: "📊", label: "Career Strategy" },
  { emoji: "🤖", label: "AI Persona Development" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VIEWS = ["M", "W", "D", "A"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days: { day: number; current: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, current: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false });
  }
  return days;
}

const FlipDigit = ({ value }: { value: string }) => (
  <div className="bg-foreground text-background rounded-lg px-3 py-2 text-4xl font-bold font-mono min-w-[56px] text-center relative overflow-hidden">
    <div className="absolute inset-x-0 top-1/2 h-px bg-background/20" />
    {value}
  </div>
);

const FlipClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  return (
    <div className="flex items-center gap-1">
      <FlipDigit value={String(hours).padStart(2, "0")} />
      <span className="text-3xl font-bold text-foreground">:</span>
      <FlipDigit value={String(minutes).padStart(2, "0")} />
      <span className="text-3xl font-bold text-foreground">:</span>
      <FlipDigit value={String(seconds).padStart(2, "0")} />
      <span className="text-sm font-bold text-foreground ml-1 self-end mb-1">{ampm}</span>
    </div>
  );
};

const Profile = () => {
  const [currentMonth, setCurrentMonth] = useState(3); // April
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedView, setSelectedView] = useState("M");
  const today = new Date();
  const calendarDays = getCalendarDays(currentYear, currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };
  const goToday = () => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted" />
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            Andressa <Pencil className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </h1>
        </div>
        <Settings className="h-6 w-6 text-muted-foreground cursor-pointer" />
      </div>

      {/* Info */}
      <div className="mb-8">
        <p className="text-foreground"><span className="font-bold">Program:</span> AI-Operated Human Artist</p>
        <p className="text-foreground"><span className="font-bold">Division:</span> N-EXIE Creators</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Clock */}
          <FlipClock />

          {/* Accesses */}
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
          {/* Gallery */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">My gallery</h2>
            <div className="relative flex items-center">
              <button className="absolute -left-4 z-10 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <div
                className="w-full aspect-[4/3] rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "hsl(220, 30%, 92%)", border: "4px solid hsl(220, 30%, 88%)" }}
              >
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
              <button className="absolute -right-4 z-10 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-2xl font-serif">{monthNames[currentMonth]}</span>
              <button onClick={prevMonth}><ChevronLeft className="h-5 w-5 text-foreground" /></button>
              <span className="text-2xl font-bold">{currentYear}</span>
              <button onClick={nextMonth}><ChevronRight className="h-5 w-5 text-foreground" /></button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button onClick={prevMonth} className="px-3 py-1.5 hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={goToday} className="px-4 py-1.5 border-x border-border text-sm font-medium hover:bg-muted">Today</button>
                <button onClick={nextMonth} className="px-3 py-1.5 hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
              </div>
              <div className="flex border border-border rounded-lg overflow-hidden">
                {VIEWS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedView(v)}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedView === v ? "bg-muted font-bold" : "hover:bg-muted/50"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {DAYS.map((d) => (
                    <th key={d} className="py-2 text-sm font-bold text-foreground border border-border">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, week) => (
                  <tr key={week}>
                    {calendarDays.slice(week * 7, week * 7 + 7).map((d, i) => {
                      const isToday =
                        d.current &&
                        d.day === today.getDate() &&
                        currentMonth === today.getMonth() &&
                        currentYear === today.getFullYear();
                      return (
                        <td
                          key={i}
                          className={`py-3 text-center text-sm border border-border cursor-pointer hover:bg-muted/50 ${
                            d.current ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {isToday ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-background" style={{ backgroundColor: "hsl(210, 80%, 55%)" }}>
                              {d.day}
                            </span>
                          ) : (
                            d.day
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
