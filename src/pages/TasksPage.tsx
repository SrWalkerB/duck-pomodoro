import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskItem } from "@/components/Tasks/TaskItem";
import { TaskForm } from "@/components/Tasks/TaskForm";
import type { Task } from "@/lib/types";

interface TasksPageProps {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  onCreateTask: (name: string, description: string) => Promise<void>;
  onUpdateTask: (id: number, name: string, description: string) => Promise<void>;
  onToggleComplete: (id: number) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

export function TasksPage({
  activeTasks,
  completedTasks,
  onCreateTask,
  onUpdateTask,
  onToggleComplete,
  onDeleteTask,
}: TasksPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreate = async (name: string, description: string) => {
    await onCreateTask(name, description);
    setShowForm(false);
  };

  const handleEdit = async (name: string, description: string) => {
    if (!editingTask) return;
    await onUpdateTask(editingTask.id, name, description);
    setEditingTask(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tarefas</h1>
        <Button
          size="lg"
          onClick={() => setShowForm(true)}
          className="bg-accent-work text-white hover:bg-accent-work/90"
        >
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTasks.length === 0 && completedTasks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <p className="text-lg">Nenhuma tarefa ainda</p>
            <p className="text-sm">Crie uma tarefa para vincular aos seus pomodoros</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {activeTasks.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Ativas ({activeTasks.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {activeTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={onToggleComplete}
                      onEdit={setEditingTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Concluídas ({completedTasks.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={onToggleComplete}
                      onEdit={setEditingTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm
          title="Nova Tarefa"
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          title="Editar Tarefa"
          initialName={editingTask.name}
          initialDescription={editingTask.description}
          onSubmit={handleEdit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
