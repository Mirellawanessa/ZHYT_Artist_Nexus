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
    <div className="w-full">
      {/* Header Notion-like */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-4">
          <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
          <div className="flex items-center rounded-md border border-input shadow-sm overflow-hidden">
            <button onClick={prevMonth} className="px-2 py-1.5 hover:bg-muted border-r border-input transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={nextMonth} className="px-2 py-1.5 hover:bg-muted border-r border-input transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
            <button onClick={goToday} className="px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
              Today
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            if (!selectedDate) setSelectedDate(today.toISOString().split("T")[0]);
            setShowAddDialog(true);
          }}
          className="flex items-center justify-center gap-2 bg-foreground text-background hover:opacity-90 px-3 py-1.5 rounded-md font-medium text-sm transition-opacity shadow-sm whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> New Event
        </button>
      </div>

      {/* Calendar Grid Notion-like */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              {DAYS.map((d) => (
                <th key={d} className="py-2.5 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground border-b border-border/50 bg-muted/20">
                  {d}
                </th>
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
                      className={`h-24 md:h-32 p-1.5 align-top border-b border-r border-border/50 cursor-pointer hover:bg-muted/30 transition-colors ${i === 6 ? "border-r-0" : ""} ${!d.current ? "bg-muted/10 opacity-50" : ""} ${isSelected ? "ring-2 ring-foreground/20 ring-inset bg-muted/20" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="opacity-0"></span>
                        <div className={`text-[11px] font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-destructive text-destructive-foreground font-bold" : "text-foreground"} ${!d.current && !isToday ? "text-muted-foreground" : ""}`}>
                          {d.day}
                        </div>
                      </div>
                      <div className="space-y-[2px] overflow-hidden">
                        {dayEvts.slice(0, 3).map((ev) => (
                          <div
                            key={ev.id}
                            className="text-[10px] sm:text-xs truncate px-1.5 py-0.5 rounded transition-opacity"
                            style={{ backgroundColor: ev.color + "20", color: ev.color, borderLeft: `2px solid ${ev.color}` }}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayEvts.length > 3 && (
                          <div className="text-[10px] text-muted-foreground font-medium px-1">+{dayEvts.length - 3} mais</div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
