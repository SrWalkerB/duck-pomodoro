import { useState, useMemo } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { TimerDisplay } from "@/components/Timer/TimerDisplay";
import { TimerControls } from "@/components/Timer/TimerControls";
import { ModeSelector } from "@/components/Timer/ModeSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TimerController } from "@/hooks/useTimer";
import { BUILT_IN_SOUNDS } from "@/lib/sounds";
import type { Settings, Task, TimerMode, UserSound } from "@/lib/types";

interface PomodoroPageProps {
  settings: Settings;
  tasks: Task[];
  userSounds: UserSound[];
  timer: TimerController;
  isMuted: boolean;
  onToggleMute: () => void;
  onChangeSoundSource: (source: string) => void;
}

export function PomodoroPage({
  settings,
  tasks,
  userSounds,
  timer,
  isMuted,
  onToggleMute,
  onChangeSoundSource,
}: PomodoroPageProps) {
  const [mode, setMode] = useState<TimerMode>("simple");

  const soundItems = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of BUILT_IN_SOUNDS) {
      map[s.id] = s.name;
    }
    for (const s of userSounds) {
      map[`custom:${s.id}`] = s.name;
    }
    return map;
  }, [userSounds]);

  const isActive = timer.timerState !== "idle";

  const handleStart = () => {
    if (mode === "task" && !timer.currentTaskId) return;
    timer.start(mode === "task" ? timer.currentTaskId ?? undefined : undefined);
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    if (newMode === "simple") {
      timer.selectTask(null);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <ModeSelector
        mode={mode}
        onModeChange={handleModeChange}
        tasks={tasks}
        selectedTaskId={timer.currentTaskId}
        onTaskSelect={timer.selectTask}
        disabled={isActive}
      />

      <TimerDisplay
        timeRemaining={timer.timeRemaining}
        sessionType={timer.sessionType}
        completedPomodoros={timer.completedPomodoros}
        totalInCycle={timer.totalInCycle}
      />

      <TimerControls
        timerState={timer.timerState}
        onStart={handleStart}
        onPause={timer.pause}
        onResume={timer.resume}
        onStop={timer.stop}
        onSkip={timer.skip}
      />

      {settings.sound_enabled ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            className="text-text-secondary hover:text-text-primary transition-colors"
            title={isMuted ? "Ativar som" : "Silenciar"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <Select
            value={settings.sound_source}
            onValueChange={(val) => {
              if (val) onChangeSoundSource(val);
            }}
            items={soundItems}
          >
            <SelectTrigger size="sm" className="h-7 gap-1 border-none bg-transparent px-2 text-xs text-text-secondary hover:text-text-primary">
              <Music className="h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Embutidos</SelectLabel>
                {BUILT_IN_SOUNDS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectGroup>
              {userSounds.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Importados</SelectLabel>
                  {userSounds.map((s) => (
                    <SelectItem key={`custom:${s.id}`} value={`custom:${s.id}`}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {timer.currentTaskId && (
        <p className="text-sm text-text-secondary">
          Tarefa:{" "}
          <span className="text-text-primary">
            {tasks.find((t) => t.id === timer.currentTaskId)?.name}
          </span>
        </p>
      )}
    </div>
  );
}
