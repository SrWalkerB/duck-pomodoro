import { appDataDir, join } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { copyFile, mkdir, exists, readFile } from "@tauri-apps/plugin-fs";

export interface BuiltInSound {
  id: string;
  name: string;
  file: string;
}

export const BUILT_IN_SOUNDS: BuiltInSound[] = [
  { id: "rain", name: "Chuva", file: "/sounds/song_rain.m4a" },
];

export function getBuiltInSoundUrl(id: string): string | null {
  const sound = BUILT_IN_SOUNDS.find((s) => s.id === id);
  if (!sound) return null;
  return sound.file;
}

// Cache blob URLs to avoid re-reading files
const blobUrlCache = new Map<string, string>();

export async function getUserSoundUrl(filename: string): Promise<string> {
  const cached = blobUrlCache.get(filename);
  if (cached) return cached;

  const dataDir = await appDataDir();
  const path = await join(dataDir, "sounds", filename);
  const bytes = await readFile(path);

  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const mimeMap: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    ogg: "audio/ogg",
    flac: "audio/flac",
  };
  const mime = mimeMap[ext] ?? "audio/mpeg";

  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  blobUrlCache.set(filename, url);
  return url;
}

export async function pickAndCopySound(): Promise<{
  name: string;
  filename: string;
  originalPath: string;
} | null> {
  const selected = await open({
    multiple: false,
    filters: [
      {
        name: "Audio",
        extensions: ["mp3", "wav", "m4a", "ogg", "flac"],
      },
    ],
  });

  if (!selected) return null;

  const dataDir = await appDataDir();
  const soundsDir = await join(dataDir, "sounds");

  const dirExists = await exists(soundsDir);
  if (!dirExists) {
    await mkdir(soundsDir, { recursive: true });
  }

  const originalName = selected.split(/[/\\]/).pop()!;
  const uniqueFilename = `${Date.now()}_${originalName}`;
  const destPath = await join(soundsDir, uniqueFilename);

  await copyFile(selected, destPath);

  const displayName = originalName.replace(/\.[^.]+$/, "");

  return {
    name: displayName,
    filename: uniqueFilename,
    originalPath: selected,
  };
}
