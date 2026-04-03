import { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { useSessions } from "@/hooks/useSessions";
import { SESSION_LABELS } from "@/lib/types";

export function HistoryPage() {
  const { sessions, loading } = useSessions();
  const [, setTick] = useState(0);

  useEffect(() => {
    setTick((t) => t + 1);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    return `${min}min`;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-8 text-2xl font-semibold">Histórico</h1>

      {sessions.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
          <p className="text-lg">Nenhuma sessão ainda</p>
          <p className="text-sm">Complete um pomodoro para ver o histórico</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      session.type === "work"
                        ? "var(--accent-work)"
                        : session.type === "short_break"
                          ? "var(--accent-short-break)"
                          : "var(--accent-long-break)",
                  }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {SESSION_LABELS[session.type]}
                    </span>
                    {!session.completed && (
                      <span className="rounded bg-accent-work-muted px-1.5 py-0.5 text-xs text-accent-work">
                        Interrompido
                      </span>
                    )}
                  </div>
                  {session.task_name && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {session.task_name}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(session.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(session.started_at)} {formatTime(session.started_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
