import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Layout } from "@/components/Layout";
import { PomodoroPage } from "@/pages/PomodoroPage";
import { TasksPage } from "@/pages/TasksPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { StatsPage } from "@/pages/StatsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";
import { useTasks } from "@/hooks/useTasks";
import { useTimer } from "@/hooks/useTimer";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { useUserSounds } from "@/hooks/useUserSounds";
import { getDb } from "@/lib/database";
import { ensureNotificationPermission } from "@/lib/notifications";
import type { Page } from "@/lib/types";
import {
  checkForUpdates,
  downloadAndInstallUpdate,
  type UpdaterState,
} from "@/lib/updater";
import type { Update } from "@tauri-apps/plugin-updater";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("pomodoro");
  const [dbReady, setDbReady] = useState(false);
  const [updaterState, setUpdaterState] = useState<UpdaterState>("idle");
  const [updaterMessage, setUpdaterMessage] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [availableVersion, setAvailableVersion] = useState<string | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<Update | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const hasCheckedOnBoot = useRef(false);
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

  const timer = useTimer({ settings, onSessionComplete: handleSessionComplete });

  const userSoundFilenames = useMemo(() => {
    const map = new Map<number, string>();
    for (const s of userSounds) {
      map.set(s.id, s.filename);
    }
    return map;
  }, [userSounds]);

  const ambientSound = useAmbientSound({
    timerState: timer.timerState,
    sessionType: timer.sessionType,
    settings,
    userSoundFilenames,
  });

  const runUpdateCheck = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      try {
        setUpdaterState("checking");
        setUpdaterMessage(silent ? null : "Verificando atualizações...");
        const result = await checkForUpdates();
        setCurrentVersion(result.currentVersion);

        if (result.status === "available") {
          setPendingUpdate(result.update);
          setAvailableVersion(result.nextVersion);
          setUpdaterState("available");
          setUpdaterMessage(`Nova versão disponível: ${result.nextVersion}`);
          setShowUpdatePrompt(true);
          return;
        }

        setPendingUpdate(null);
        setAvailableVersion(null);
        setUpdaterState("up_to_date");
        setUpdaterMessage("Você está na versão mais recente.");
      } catch (error) {
        console.error("Erro ao verificar atualização:", error);
        setUpdaterState("error");
        if (!silent) {
          setUpdaterMessage("Não foi possível verificar atualizações no momento.");
        }
      }
    },
    []
  );

  const installPendingUpdate = useCallback(async () => {
    if (!pendingUpdate) return;

    try {
      setUpdaterState("installing");
      setUpdaterMessage("Baixando e instalando atualização...");
      await downloadAndInstallUpdate(pendingUpdate);
      setPendingUpdate(null);
      setUpdaterState("installed");
      setShowUpdatePrompt(false);
      setUpdaterMessage("Atualização instalada. Reinicie o app para concluir.");
    } catch (error) {
      console.error("Erro ao instalar atualização:", error);
      setUpdaterState("error");
      setUpdaterMessage("Falha ao instalar atualização.");
    }
  }, [pendingUpdate]);

  useEffect(() => {
    if (!dbReady || settingsLoading) return;
    if (!settings.auto_update_enabled) return;
    if (hasCheckedOnBoot.current) return;

    hasCheckedOnBoot.current = true;
    void runUpdateCheck({ silent: true });
  }, [dbReady, settingsLoading, settings.auto_update_enabled, runUpdateCheck]);

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
          timer={timer}
          isMuted={ambientSound.isMuted}
          onToggleMute={ambientSound.toggleMute}
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
          updaterState={updaterState}
          updaterMessage={updaterMessage}
          currentVersion={currentVersion}
          availableVersion={availableVersion}
          onCheckForUpdates={() => runUpdateCheck({ silent: false })}
          onInstallUpdate={installPendingUpdate}
        />
      )}

      {showUpdatePrompt && pendingUpdate && (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm rounded-xl border border-accent-work/30 bg-card p-4 shadow-2xl">
          <h2 className="text-sm font-semibold text-foreground">
            Atualização disponível
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Versão {availableVersion} disponível para instalar.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              onClick={installPendingUpdate}
              disabled={updaterState === "installing"}
            >
              {updaterState === "installing" ? "Instalando..." : "Atualizar agora"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowUpdatePrompt(false)}
              disabled={updaterState === "installing"}
            >
              Depois
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
