import { getVersion } from "@tauri-apps/api/app";
import { check, type Update } from "@tauri-apps/plugin-updater";

export type UpdaterState =
  | "idle"
  | "checking"
  | "available"
  | "up_to_date"
  | "installing"
  | "installed"
  | "error";

export type UpdateCheckResult =
  | {
      status: "up_to_date";
      currentVersion: string;
    }
  | {
      status: "available";
      currentVersion: string;
      update: Update;
      nextVersion: string;
      notes: string;
    };

export async function checkForUpdates(): Promise<UpdateCheckResult> {
  const currentVersion = await getVersion();
  const update = await check();

  if (!update) {
    return { status: "up_to_date", currentVersion };
  }

  return {
    status: "available",
    currentVersion,
    update,
    nextVersion: update.version,
    notes: update.body ?? "",
  };
}

export async function downloadAndInstallUpdate(update: Update): Promise<void> {
  await update.downloadAndInstall();
}
