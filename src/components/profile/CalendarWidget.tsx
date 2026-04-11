import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VIEWS = ["M", "W", "D", "A"];
const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface CalendarEvent {
  id: string;
  event_date: string;
  title: string;
  description: string | null;
  color: string;
}

interface CalendarWidgetProps {
  events: CalendarEvent[];
  userId: string;
  onEventsChange: () => void;
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days: { day: number; current: boolean; dateStr: string }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    days.push({ day: d, current: false, dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true, dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}` });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    days.push({ day: i, current: false, dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}` });
  }
  return days;
}

export const CalendarWidget = ({ events, userId, onEventsChange }: CalendarWidgetProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedView, setSelectedView] = useState("M");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);
  const { toast } = useToast();

  const calendarDays = getCalendarDays(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };
  const goToday = () => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); };

  const getEventsForDate = (dateStr: string) => events.filter(e => e.event_date === dateStr);

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const addEvent = async () => {
    if (!newTitle.trim() || !selectedDate) return;
    const { error } = await supabase.from("calendar_events").insert({
      user_id: userId,
      event_date: selectedDate,
      title: newTitle.trim(),
      description: newDesc.trim() || null,
      color: newColor,
    });
    if (error) {
      toast({ title: "Error adding event", variant: "destructive" });
    } else {
      setNewTitle("");
      setNewDesc("");
      setNewColor(COLORS[0]);
      setShowAddDialog(false);
      onEventsChange();
    }
  };

  const deleteEvent = async (id: string) => {
    await supabase.from("calendar_events").delete().eq("id", id);
    onEventsChange();
  };

  const dayEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Month header */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-2xl font-serif">{MONTH_NAMES[currentMonth]}</span>
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
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${selectedView === v ? "bg-muted font-bold" : "hover:bg-muted/50"}`}
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
                const isToday = d.current && d.day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                const dayEvts = getEventsForDate(d.dateStr);
                const isSelected = selectedDate === d.dateStr;
                return (
                  <td
                    key={i}
                    onClick={() => handleDayClick(d.dateStr)}
                    className={`py-2 text-center text-sm border border-border cursor-pointer hover:bg-muted/50 relative ${
                      d.current ? "text-foreground" : "text-muted-foreground"
                    } ${isSelected ? "bg-muted" : ""}`}
                    style={{ minHeight: 48 }}
                  >
                    {isToday ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-background" style={{ backgroundColor: "hsl(210, 80%, 55%)" }}>
                        {d.day}
                      </span>
                    ) : (
                      d.day
                    )}
                    {dayEvts.length > 0 && (
                      <div className="flex justify-center gap-0.5 mt-0.5">
                        {dayEvts.slice(0, 3).map((ev) => (
                          <span key={ev.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ev.color }} />
                        ))}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Selected day events panel */}
      {selectedDate && (
        <div className="mt-4 p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
            <div className="flex gap-2">
              <button onClick={() => setShowAddDialog(true)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" /> Add
              </button>
              <button onClick={() => setSelectedDate(null)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          {dayEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events for this day</p>
          ) : (
            <div className="space-y-2">
              {dayEvents.map((ev) => (
                <div key={ev.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50">
                  <span className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: ev.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{ev.title}</p>
                    {ev.description && <p className="text-xs text-muted-foreground">{ev.description}</p>}
                  </div>
                  <button onClick={() => deleteEvent(ev.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add event dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              autoFocus
              placeholder="Event title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addEvent(); }}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div>
              <p className="text-sm font-medium mb-2 text-foreground">Color</p>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`w-7 h-7 rounded-full transition-all ${newColor === c ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={addEvent}
              disabled={!newTitle.trim()}
              className="w-full h-10 rounded-md bg-foreground text-background font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Save Event
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
