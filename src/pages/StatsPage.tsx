import { useEffect, useState } from "react";
import { Clock, Target, Flame, TrendingUp } from "lucide-react";
import { useSessions, type TaskStats, type DayStats } from "@/hooks/useSessions";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
}

function StatCard({ icon, label, value, sublabel }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-3xl font-semibold">{value}</span>
      {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
    </div>
  );
}

const DAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

function WeeklyChart({
  last7Days,
  weekTotal,
  avgPerDay,
  record,
}: {
  last7Days: DayStats[];
  weekTotal: number;
  avgPerDay: string;
  record: number;
}) {
  const maxSessions = Math.max(...last7Days.map((d) => d.total_sessions), 1);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Últimos 7 dias
      </div>
      <div className="mb-6 flex items-end justify-between gap-2">
        {last7Days.map((day) => {
          const height = maxSessions > 0
            ? Math.max(6, (day.total_sessions / maxSessions) * 90)
            : 6;
          const isToday = day.date === today;
          const dayOfWeek = new Date(day.date + "T12:00:00").getDay();
          return (
            <div key={day.date} className="flex flex-col items-center gap-1.5">
              <div
                className="w-5 rounded-sm transition-all"
                style={{
                  height: `${height}px`,
                  backgroundColor: "var(--color-accent-work)",
                  opacity: isToday ? 1 : 0.3,
                }}
                title={`${day.date}: ${day.total_sessions} sessões`}
              />
              <span className={`text-[10px] ${isToday ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {DAY_LABELS[dayOfWeek]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
        <div className="text-center">
          <div className="text-lg font-bold text-accent-work">{weekTotal}</div>
          <div className="text-[10px] text-muted-foreground">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent-short-break">{avgPerDay}</div>
          <div className="text-[10px] text-muted-foreground">Média/dia</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-accent-long-break">{record}</div>
          <div className="text-[10px] text-muted-foreground">Recorde</div>
        </div>
      </div>
    </div>
  );
}

interface Stats {
  total: { total: number; minutes: number };
  today: { total: number; minutes: number };
  week: { total: number; minutes: number };
  taskBreakdown: TaskStats[];
  dailyHistory: DayStats[];
  last7Days: DayStats[];
  record: number;
}

export function StatsPage() {
  const { getOverallStats } = useSessions();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    getOverallStats().then(setStats);
  }, [getOverallStats]);

  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  const formatHours = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  };

  const avgPerDay = stats.last7Days.length > 0
    ? (stats.last7Days.reduce((a, d) => a + d.total_sessions, 0) / 7).toFixed(1)
    : "0";

  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-8 text-2xl font-semibold">Estatísticas</h1>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<Flame className="h-4 w-4" />}
            label="Hoje"
            value={String(stats.today.total)}
            sublabel={`${formatHours(stats.today.minutes)} de foco`}
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Semana"
            value={String(stats.week.total)}
            sublabel={`${formatHours(stats.week.minutes)} de foco`}
          />
          <StatCard
            icon={<Target className="h-4 w-4" />}
            label="Total"
            value={String(stats.total.total)}
            sublabel={`${formatHours(stats.total.minutes)} de foco`}
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Média diária"
            value={
              stats.dailyHistory.length > 0
                ? formatHours(
                    Math.round(
                      stats.dailyHistory.reduce((a, d) => a + d.total_minutes, 0) /
                        stats.dailyHistory.length
                    )
                  )
                : "0min"
            }
            sublabel="últimos 30 dias"
          />
        </div>

        <div className="mt-8">
          <WeeklyChart
            last7Days={stats.last7Days}
            weekTotal={stats.week.total}
            avgPerDay={avgPerDay}
            record={stats.record}
          />
        </div>

        {stats.taskBreakdown.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Por Tarefa
            </h2>
            <div className="flex flex-col gap-2">
              {stats.taskBreakdown.map((task) => {
                const maxMinutes = Math.max(
                  ...stats.taskBreakdown.map((t) => t.total_minutes)
                );
                const pct = maxMinutes > 0 ? (task.total_minutes / maxMinutes) * 100 : 0;
                return (
                  <div
                    key={task.task_id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">{task.task_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {task.total_sessions} pomodoros &middot;{" "}
                        {formatHours(task.total_minutes)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-accent-work transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stats.dailyHistory.length > 0 && (
          <div className="mt-8 mb-4">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Últimos 30 dias
            </h2>
            <div className="flex items-end gap-1">
              {stats.dailyHistory
                .slice()
                .reverse()
                .map((day) => {
                  const maxSessions = Math.max(
                    ...stats.dailyHistory.map((d) => d.total_sessions)
                  );
                  const height =
                    maxSessions > 0
                      ? Math.max(4, (day.total_sessions / maxSessions) * 80)
                      : 4;
                  return (
                    <div
                      key={day.date}
                      className="w-3 max-w-3 rounded-sm bg-accent-work/60 transition-all hover:bg-accent-work"
                      style={{ height: `${height}px` }}
                      title={`${day.date}: ${day.total_sessions} sessões`}
                    />
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
