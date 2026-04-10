import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const lines = [
  "The spotlight awaits you.",
  "The world is yours",
  "to inspire.",
];

const Welcome = () => {
  const navigate = useNavigate();
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    lines.forEach((_, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, 400 * (i + 1));
    });

    setTimeout(() => setShowSubtext(true), 400 * (lines.length + 1));
    setTimeout(() => navigate("/profile"), 400 * (lines.length + 3));
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-8">
      <div className="max-w-4xl w-full">
        <div className="space-y-2">
          {lines.map((line, i) => (
            <h1
              key={i}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight transition-all duration-700 ease-out"
              style={{
                opacity: visibleLines.includes(i) ? 1 : 0,
                transform: visibleLines.includes(i)
                  ? "translateX(0)"
                  : "translateX(-80px)",
              }}
            >
              {line}
            </h1>
          ))}
        </div>
        <p
          className="text-xl md:text-2xl text-foreground font-semibold mt-16 transition-all duration-700 ease-out"
          style={{
            opacity: showSubtext ? 1 : 0,
            transform: showSubtext ? "translateX(0)" : "translateX(-40px)",
          }}
        >
          Your journey with FAME & CO. begins here.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
