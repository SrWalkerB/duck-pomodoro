import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import type { SessionType } from "./types";

const NOTIFICATION_MESSAGES: Record<SessionType, { title: string; body: string }> = {
  work: {
    title: "Pomodoro finalizado!",
    body: "Hora de fazer uma pausa. Descanse um pouco!",
  },
  short_break: {
    title: "Pausa encerrada!",
    body: "Hora de voltar ao foco. Bora!",
  },
  long_break: {
    title: "Pausa longa encerrada!",
    body: "Descansou bem? Hora de voltar com tudo!",
  },
};

export async function ensureNotificationPermission(): Promise<boolean> {
  let granted = await isPermissionGranted();
  if (!granted) {
    const permission = await requestPermission();
    granted = permission === "granted";
  }
  return granted;
}

export async function notifySessionEnd(type: SessionType): Promise<void> {
  const granted = await ensureNotificationPermission();
  if (!granted) return;

  const message = NOTIFICATION_MESSAGES[type];
  sendNotification({ title: message.title, body: message.body });
}
