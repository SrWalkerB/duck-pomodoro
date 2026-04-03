import { useMemo } from "react";
import { ListTodo, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, TimerMode } from "@/lib/types";

interface ModeSelectorProps {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
  tasks: Task[];
  selectedTaskId: number | null;
  onTaskSelect: (taskId: number | null) => void;
  disabled: boolean;
}

export function ModeSelector({
  mode,
  onModeChange,
  tasks,
  selectedTaskId,
  onTaskSelect,
  disabled,
}: ModeSelectorProps) {
  const taskItems = useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of tasks) {
      map[t.id.toString()] = t.name;
    }
    return map;
  }, [tasks]);

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-3">
      <div className="flex gap-1 rounded-xl bg-card p-1.5">
        <Button
          variant={mode === "simple" ? "secondary" : "ghost"}
          size="lg"
          onClick={() => onModeChange("simple")}
          disabled={disabled}
        >
          <Timer className="h-4 w-4" />
          Simples
        </Button>
        <Button
          variant={mode === "task" ? "secondary" : "ghost"}
          size="lg"
          onClick={() => onModeChange("task")}
          disabled={disabled}
        >
          <ListTodo className="h-4 w-4" />
          Com Tarefa
        </Button>
      </div>

      {mode === "task" && (
        <Select
          value={selectedTaskId?.toString() ?? null}
          onValueChange={(val) =>
            onTaskSelect(val ? Number(val) : null)
          }
          disabled={disabled}
          items={taskItems}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione uma tarefa..." />
          </SelectTrigger>
          <SelectContent>
            {tasks.map((task) => (
              <SelectItem key={task.id} value={task.id.toString()}>
                {task.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
