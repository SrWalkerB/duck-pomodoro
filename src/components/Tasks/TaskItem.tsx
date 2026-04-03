import { Check, Pencil, Trash2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-ring ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors"
        style={{
          borderColor: task.completed ? "var(--accent-short-break)" : "var(--border)",
          backgroundColor: task.completed ? "var(--accent-short-break)" : "transparent",
        }}
      >
        {task.completed ? <Check className="h-3 w-3 text-white" /> : null}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${
            task.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.name}
        </p>
        {task.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Timer className="h-3.5 w-3.5" />
        <span>{task.total_pomodoros}</span>
      </div>

      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(task)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={() => onDelete(task.id)} className="hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
