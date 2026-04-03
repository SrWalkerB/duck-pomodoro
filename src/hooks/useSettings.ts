import { useState, useEffect, useCallback } from "react";
import { getDb } from "@/lib/database";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/types";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    const db = await getDb();
    const rows = await db.select<Settings[]>("SELECT * FROM settings WHERE id = 1");
    if (rows.length > 0) {
      setSettings(rows[0]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(async (newSettings: Settings) => {
    const db = await getDb();
    await db.execute(
      `UPDATE settings SET
        work_duration = $1,
        short_break_duration = $2,
        long_break_duration = $3,
        pomodoros_before_long_break = $4,
        sound_enabled = $5,
        sound_source = $6,
        sound_volume = $7
      WHERE id = 1`,
      [
        newSettings.work_duration,
        newSettings.short_break_duration,
        newSettings.long_break_duration,
        newSettings.pomodoros_before_long_break,
        newSettings.sound_enabled,
        newSettings.sound_source,
        newSettings.sound_volume,
      ]
    );
    setSettings(newSettings);
  }, []);

  return { settings, loading, updateSettings };
}
