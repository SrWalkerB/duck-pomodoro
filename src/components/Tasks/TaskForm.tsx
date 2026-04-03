import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskFormProps {
  onSubmit: (name: string, description: string) => void;
  onClose: () => void;
  initialName?: string;
  initialDescription?: string;
  title: string;
}

export function TaskForm({
  onSubmit,
  onClose,
  initialName = "",
  initialDescription = "",
  title,
}: TaskFormProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), description.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Nome da tarefa
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Estudar React"
              autoFocus
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Descrição (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre a tarefa..."
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="bg-accent-work text-white hover:bg-accent-work/90"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
