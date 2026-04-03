import { Play, Pause, Square, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimerState } from "@/lib/types";

interface TimerControlsProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSkip: () => void;
}

export function TimerControls({
  timerState,
  onStart,
  onPause,
  onResume,
  onStop,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {timerState === "idle" && (
        <Button
          size="icon-lg"
          onClick={onStart}
          className="h-14 w-14 rounded-full bg-accent-work text-white hover:bg-accent-work/90"
        >
          <Play className="ml-1 h-6 w-6" />
        </Button>
      )}

      {timerState === "running" && (
        <Button
          size="icon-lg"
          variant="secondary"
          onClick={onPause}
          className="h-14 w-14 rounded-full"
        >
          <Pause className="h-6 w-6" />
        </Button>
      )}

      {timerState === "paused" && (
        <Button
          size="icon-lg"
          onClick={onResume}
          className="h-14 w-14 rounded-full bg-accent-work text-white hover:bg-accent-work/90"
        >
          <Play className="ml-1 h-6 w-6" />
        </Button>
      )}

      {timerState !== "idle" && (
        <>
          <Button
            variant="secondary"
            size="icon"
            onClick={onStop}
            className="h-10 w-10 rounded-full"
            title="Parar"
          >
            <Square className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={onSkip}
            className="h-10 w-10 rounded-full"
            title="Pular"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
