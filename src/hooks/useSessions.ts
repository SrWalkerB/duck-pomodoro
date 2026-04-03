import { useState, useEffect, useCallback } from "react";
import { getDb } from "@/lib/database";
import type { PomodoroSession } from "@/lib/types";

export interface DayStats {
  date: string;
  total_sessions: number;
  total_minutes: number;
}

export interface TaskStats {
  task_id: number;
  task_name: string;
  total_sessions: number;
  total_minutes: number;
}

export function useSessions(taskId?: number) {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    const db = await getDb();
    let rows: PomodoroSession[];
    if (taskId) {
      rows = await db.select<PomodoroSession[]>(
        `SELECT s.*, t.name as task_name
         FROM pomodoro_sessions s
         LEFT JOIN tasks t ON s.task_id = t.id
         WHERE s.task_id = $1
         ORDER BY s.started_at DESC`,
        [taskId]
      );
    } else {
      rows = await db.select<PomodoroSession[]>(
        `SELECT s.*, t.name as task_name
         FROM pomodoro_sessions s
         LEFT JOIN tasks t ON s.task_id = t.id
         ORDER BY s.started_at DESC
         LIMIT 100`
      );
    }
    setSessions(rows);
    setLoading(false);
  }, [taskId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const getOverallStats = useCallback(async () => {
    const db = await getDb();

    const totalRows = await db.select<{ total: number; minutes: number }[]>(
      `SELECT COUNT(*) as total, COALESCE(SUM(duration), 0) / 60 as minutes
       FROM pomodoro_sessions WHERE completed = 1 AND type = 'work'`
    );

    const todayRows = await db.select<{ total: number; minutes: number }[]>(
      `SELECT COUNT(*) as total, COALESCE(SUM(duration), 0) / 60 as minutes
       FROM pomodoro_sessions
       WHERE completed = 1 AND type = 'work'
       AND date(started_at) = date('now')`
    );

    const weekRows = await db.select<{ total: number; minutes: number }[]>(
      `SELECT COUNT(*) as total, COALESCE(SUM(duration), 0) / 60 as minutes
       FROM pomodoro_sessions
       WHERE completed = 1 AND type = 'work'
       AND date(started_at) >= date('now', '-7 days')`
    );

    const taskBreakdown = await db.select<TaskStats[]>(
      `SELECT s.task_id, t.name as task_name,
              COUNT(*) as total_sessions,
              SUM(s.duration) / 60 as total_minutes
       FROM pomodoro_sessions s
       JOIN tasks t ON s.task_id = t.id
       WHERE s.completed = 1 AND s.type = 'work'
       GROUP BY s.task_id
       ORDER BY total_minutes DESC`
    );

    const dailyHistory = await db.select<DayStats[]>(
      `SELECT date(started_at) as date,
              COUNT(*) as total_sessions,
              SUM(duration) / 60 as total_minutes
       FROM pomodoro_sessions
       WHERE completed = 1 AND type = 'work'
       AND date(started_at) >= date('now', '-30 days')
       GROUP BY date(started_at)
       ORDER BY date DESC`
    );

    // Last 7 days (one entry per day, including days with 0 sessions)
    const last7Raw = await db.select<DayStats[]>(
      `SELECT date(started_at) as date,
              COUNT(*) as total_sessions,
              SUM(duration) / 60 as total_minutes
       FROM pomodoro_sessions
       WHERE completed = 1 AND type = 'work'
       AND date(started_at) >= date('now', '-6 days')
       GROUP BY date(started_at)
       ORDER BY date ASC`
    );

    // Fill missing days with zeros
    const last7Days: DayStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = last7Raw.find((r) => r.date === dateStr);
      last7Days.push(found ?? { date: dateStr, total_sessions: 0, total_minutes: 0 });
    }

    // Record (max sessions in a single day, last 30 days)
    const recordRow = await db.select<{ record: number }[]>(
      `SELECT MAX(cnt) as record FROM (
        SELECT COUNT(*) as cnt FROM pomodoro_sessions
        WHERE completed = 1 AND type = 'work'
        AND date(started_at) >= date('now', '-30 days')
        GROUP BY date(started_at)
      )`
    );

    return {
      total: totalRows[0] ?? { total: 0, minutes: 0 },
      today: todayRows[0] ?? { total: 0, minutes: 0 },
      week: weekRows[0] ?? { total: 0, minutes: 0 },
      taskBreakdown,
      dailyHistory,
      last7Days,
      record: recordRow[0]?.record ?? 0,
    };
  }, []);

  return { sessions, loading, reload: loadSessions, getOverallStats };
}
