export interface Task {
  id: number;
  name: string;
  description: string;
  created_at: string;
  completed: number;
  total_pomodoros: number;
}

export interface PomodoroSession {
  id: number;
  task_id: number | null;
  task_name?: string;
  duration: number;
  type: SessionType;
  started_at: string;
  completed_at: string | null;
  completed: number;
}

export interface Settings {
  work_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  pomodoros_before_long_break: number;
  sound_enabled: number;
  sound_source: string;
  sound_volume: number;
}

export interface UserSound {
  id: number;
  name: string;
  filename: string;
  original_path: string | null;
  created_at: string;
}

export type TimerState = "idle" | "running" | "paused";
export type TimerMode = "simple" | "task";
export type SessionType = "work" | "short_break" | "long_break";
export type Page =
  | "pomodoro"
  | "tasks"
  | "history"
  | "stats"
  | "settings";

export const DEFAULT_SETTINGS: Settings = {
  work_duration: 1500,
  short_break_duration: 300,
  long_break_duration: 900,
  pomodoros_before_long_break: 4,
  sound_enabled: 0,
  sound_source: "rain",
  sound_volume: 0.7,
};

export const SESSION_LABELS: Record<SessionType, string> = {
  work: "Foco",
  short_break: "Pausa Curta",
  long_break: "Pausa Longa",
};

export const SESSION_COLORS: Record<SessionType, string> = {
  work: "var(--color-accent-work)",
  short_break: "var(--color-accent-short-break)",
  long_break: "var(--color-accent-long-break)",
};
