import { SESSION_LABELS, SESSION_COLORS, type SessionType } from "@/lib/types";

interface TimerDisplayProps {
  timeRemaining: number;
  sessionType: SessionType;
  completedPomodoros: number;
  totalInCycle: number;
}

export function TimerDisplay({
  timeRemaining,
  sessionType,
  completedPomodoros,
  totalInCycle,
}: TimerDisplayProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const color = SESSION_COLORS[sessionType];

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const getDurationForType = (type: SessionType) => {
    switch (type) {
      case "work": return 1500;
      case "short_break": return 300;
      case "long_break": return 900;
    }
  };
  const totalDuration = getDurationForType(sessionType);
  const progress = timeRemaining / totalDuration;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4">
      <span
        className="text-sm font-semibold uppercase tracking-widest"
        style={{ color }}
      >
        {SESSION_LABELS[sessionType]}
      </span>

      <div className="relative flex items-center justify-center">
        <svg width="260" height="260" className="-rotate-90">
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="6"
          />
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute text-6xl font-light tracking-tight tabular-nums">
          {formatted}
        </span>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: totalInCycle }).map((_, i) => (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-full transition-colors"
            style={{
              backgroundColor:
                i < completedPomodoros % totalInCycle
                  ? "var(--color-accent-work)"
                  : "var(--color-border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
