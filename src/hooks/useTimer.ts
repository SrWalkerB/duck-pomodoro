import { useState, useRef, useCallback, useEffect } from "react";
import { getDb } from "@/lib/database";
import { notifySessionEnd } from "@/lib/notifications";
import type { Settings, TimerState, SessionType } from "@/lib/types";

interface UseTimerOptions {
  settings: Settings;
  onSessionComplete?: () => void;
}

export function useTimer({ settings, onSessionComplete }: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(settings.work_duration);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [sessionType, setSessionType] = useState<SessionType>("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<string>("");
  const sessionDurationRef = useRef<number>(0);

  const getDurationForType = useCallback(
    (type: SessionType) => {
      switch (type) {
        case "work":
          return settings.work_duration;
        case "short_break":
          return settings.short_break_duration;
        case "long_break":
          return settings.long_break_duration;
      }
    },
    [settings]
  );

  useEffect(() => {
    if (timerState === "idle") {
      setTimeRemaining(getDurationForType(sessionType));
    }
  }, [settings, sessionType, timerState, getDurationForType]);

  const logSession = useCallback(
    async (type: SessionType, completed: boolean) => {
      const db = await getDb();
      const duration = completed
        ? sessionDurationRef.current
        : Math.round(
            (Date.now() - new Date(startedAtRef.current).getTime()) / 1000
          );

      await db.execute(
        `INSERT INTO pomodoro_sessions (task_id, duration, type, started_at, completed_at, completed)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          currentTaskId,
          duration,
          type,
          startedAtRef.current,
          new Date().toISOString(),
          completed ? 1 : 0,
        ]
      );

      if (completed && type === "work" && currentTaskId) {
        await db.execute(
          "UPDATE tasks SET total_pomodoros = total_pomodoros + 1 WHERE id = $1",
          [currentTaskId]
        );
      }
    },
    [currentTaskId]
  );

  const transitionToNext = useCallback(
    async (completedType: SessionType) => {
      await notifySessionEnd(completedType);
      await logSession(completedType, true);
      onSessionComplete?.();

      let nextType: SessionType;
      if (completedType === "work") {
        const newCount = completedPomodoros + 1;
        setCompletedPomodoros(newCount);
        nextType =
          newCount % settings.pomodoros_before_long_break === 0
            ? "long_break"
            : "short_break";
      } else {
        nextType = "work";
      }

      setSessionType(nextType);
      const nextDuration = getDurationForType(nextType);
      setTimeRemaining(nextDuration);
      sessionDurationRef.current = nextDuration;
      startedAtRef.current = new Date().toISOString();
    },
    [
      completedPomodoros,
      settings.pomodoros_before_long_break,
      getDurationForType,
      logSession,
      onSessionComplete,
    ]
  );

  useEffect(() => {
    if (timerState !== "running") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          transitionToNext(sessionType);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState, sessionType, transitionToNext]);

  const start = useCallback(
    (taskId?: number) => {
      if (taskId !== undefined) {
        setCurrentTaskId(taskId);
      }
      const duration = getDurationForType(sessionType);
      setTimeRemaining(duration);
      sessionDurationRef.current = duration;
      startedAtRef.current = new Date().toISOString();
      setTimerState("running");
    },
    [sessionType, getDurationForType]
  );

  const pause = useCallback(() => {
    setTimerState("paused");
  }, []);

  const resume = useCallback(() => {
    setTimerState("running");
  }, []);

  const stop = useCallback(async () => {
    if (timerState !== "idle" && startedAtRef.current) {
      await logSession(sessionType, false);
    }
    setTimerState("idle");
    setTimeRemaining(getDurationForType(sessionType));
    onSessionComplete?.();
  }, [timerState, sessionType, getDurationForType, logSession, onSessionComplete]);

  const skip = useCallback(async () => {
    if (startedAtRef.current) {
      await logSession(sessionType, false);
    }
    await transitionToNext(sessionType);
  }, [sessionType, logSession, transitionToNext]);

  const reset = useCallback(() => {
    setTimerState("idle");
    setSessionType("work");
    setCompletedPomodoros(0);
    setCurrentTaskId(null);
    setTimeRemaining(settings.work_duration);
  }, [settings.work_duration]);

  const selectTask = useCallback((taskId: number | null) => {
    setCurrentTaskId(taskId);
  }, []);

  return {
    timeRemaining,
    timerState,
    sessionType,
    completedPomodoros,
    currentTaskId,
    totalInCycle: settings.pomodoros_before_long_break,
    start,
    pause,
    resume,
    stop,
    skip,
    reset,
    selectTask,
  };
}
