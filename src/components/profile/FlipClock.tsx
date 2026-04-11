import { useState, useEffect } from "react";

const FlipDigit = ({ value }: { value: string }) => (
  <div className="bg-foreground text-background rounded-lg px-3 py-2 text-4xl font-bold font-mono min-w-[56px] text-center relative overflow-hidden">
    <div className="absolute inset-x-0 top-1/2 h-px bg-background/20" />
    {value}
  </div>
);

export const FlipClock = () => {
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
