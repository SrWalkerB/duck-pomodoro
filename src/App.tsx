import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { PomodoroPage } from "@/pages/PomodoroPage";
import { TasksPage } from "@/pages/TasksPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { StatsPage } from "@/pages/StatsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { useSettings } from "@/hooks/useSettings";
import { useTasks } from "@/hooks/useTasks";
import { useUserSounds } from "@/hooks/useUserSounds";
import { getDb } from "@/lib/database";
import { ensureNotificationPermission } from "@/lib/notifications";
import type { Page } from "@/lib/types";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("pomodoro");
  const [dbReady, setDbReady] = useState(false);
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const taskStore = useTasks();
  const { sounds: userSounds, importSound, deleteSound } = useUserSounds();

  useEffect(() => {
    getDb().then(() => {
      setDbReady(true);
      ensureNotificationPermission();
    });
  }, []);

  const handleSessionComplete = useCallback(() => {
    taskStore.reload();
  }, [taskStore]);

  if (!dbReady || settingsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-text-muted">
        Carregando...
      </div>
    );
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === "pomodoro" && (
        <PomodoroPage
          settings={settings}
          tasks={taskStore.activeTasks}
          userSounds={userSounds}
          onSessionComplete={handleSessionComplete}
          onChangeSoundSource={(source) =>
            updateSettings({ ...settings, sound_source: source })
          }
        />
      )}
      {currentPage === "tasks" && (
        <TasksPage
          tasks={taskStore.tasks}
          activeTasks={taskStore.activeTasks}
          completedTasks={taskStore.completedTasks}
          onCreateTask={taskStore.createTask}
          onUpdateTask={taskStore.updateTask}
          onToggleComplete={taskStore.toggleComplete}
          onDeleteTask={taskStore.deleteTask}
        />
      )}
      {currentPage === "history" && <HistoryPage />}
      {currentPage === "stats" && <StatsPage />}
      {currentPage === "settings" && (
        <SettingsPage
          settings={settings}
          onSave={updateSettings}
          userSounds={userSounds}
          onImportSound={importSound}
          onDeleteSound={deleteSound}
        />
      )}
    </Layout>
  );
}
