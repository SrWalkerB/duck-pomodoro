import { useState, useEffect, useCallback } from "react";
import { getDb } from "@/lib/database";
import type { Task } from "@/lib/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    const db = await getDb();
    const rows = await db.select<Task[]>(
      "SELECT * FROM tasks ORDER BY completed ASC, created_at DESC"
    );
    setTasks(rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = useCallback(
    async (name: string, description: string) => {
      const db = await getDb();
      await db.execute(
        "INSERT INTO tasks (name, description) VALUES ($1, $2)",
        [name, description]
      );
      await loadTasks();
    },
    [loadTasks]
  );

  const updateTask = useCallback(
    async (id: number, name: string, description: string) => {
      const db = await getDb();
      await db.execute(
        "UPDATE tasks SET name = $1, description = $2 WHERE id = $3",
        [name, description, id]
      );
      await loadTasks();
    },
    [loadTasks]
  );

  const toggleComplete = useCallback(
    async (id: number) => {
      const db = await getDb();
      await db.execute(
        "UPDATE tasks SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END WHERE id = $1",
        [id]
      );
      await loadTasks();
    },
    [loadTasks]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      const db = await getDb();
      await db.execute("DELETE FROM tasks WHERE id = $1", [id]);
      await loadTasks();
    },
    [loadTasks]
  );

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return {
    tasks,
    activeTasks,
    completedTasks,
    loading,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    reload: loadTasks,
  };
}
