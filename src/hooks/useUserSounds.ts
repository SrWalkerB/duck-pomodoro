import { useState, useEffect, useCallback } from "react";
import { getDb } from "../lib/database";
import { pickAndCopySound } from "../lib/sounds";
import { remove } from "@tauri-apps/plugin-fs";
import { appDataDir, join } from "@tauri-apps/api/path";
import type { UserSound } from "../lib/types";

export function useUserSounds() {
  const [sounds, setSounds] = useState<UserSound[]>([]);

  const reload = useCallback(async () => {
    const db = await getDb();
    const rows = await db.select<UserSound[]>(
      "SELECT * FROM user_sounds ORDER BY created_at DESC"
    );
    setSounds(rows);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const importSound = useCallback(async (): Promise<UserSound | null> => {
    const result = await pickAndCopySound();
    if (!result) return null;

    const db = await getDb();
    const res = await db.execute(
      "INSERT INTO user_sounds (name, filename, original_path) VALUES (?, ?, ?)",
      [result.name, result.filename, result.originalPath]
    );

    await reload();

    return {
      id: res.lastInsertId ?? 0,
      name: result.name,
      filename: result.filename,
      original_path: result.originalPath,
      created_at: new Date().toISOString(),
    };
  }, [reload]);

  const deleteSound = useCallback(
    async (id: number) => {
      const db = await getDb();
      const rows = await db.select<UserSound[]>(
        "SELECT * FROM user_sounds WHERE id = ?",
        [id]
      );
      if (rows.length > 0) {
        try {
          const dataDir = await appDataDir();
          const filePath = await join(dataDir, "sounds", rows[0].filename);
          await remove(filePath);
        } catch {
          // File may already be gone
        }
        await db.execute("DELETE FROM user_sounds WHERE id = ?", [id]);
      }
      await reload();
    },
    [reload]
  );

  return { sounds, importSound, deleteSound, reload };
}
