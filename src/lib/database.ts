import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load("sqlite:duck_pomodoro.db");
    await runMigrations(db);
  }
  return db;
}

async function runMigrations(database: Database): Promise<void> {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      work_duration INTEGER NOT NULL DEFAULT 1500,
      short_break_duration INTEGER NOT NULL DEFAULT 300,
      long_break_duration INTEGER NOT NULL DEFAULT 900,
      pomodoros_before_long_break INTEGER NOT NULL DEFAULT 4
    )
  `);

  await database.execute(`
    INSERT OR IGNORE INTO settings (id) VALUES (1)
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed INTEGER NOT NULL DEFAULT 0,
      total_pomodoros INTEGER NOT NULL DEFAULT 0
    )
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS pomodoro_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      duration INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('work', 'short_break', 'long_break')),
      started_at TEXT NOT NULL,
      completed_at TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
    )
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS user_sounds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      filename TEXT NOT NULL,
      original_path TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Add sound columns to settings (safe to run multiple times with try/catch)
  const soundColumns = [
    "sound_enabled INTEGER NOT NULL DEFAULT 0",
    "sound_source TEXT NOT NULL DEFAULT 'rain'",
    "sound_volume REAL NOT NULL DEFAULT 0.7",
    "auto_update_enabled INTEGER NOT NULL DEFAULT 1",
  ];
  for (const col of soundColumns) {
    try {
      await database.execute(`ALTER TABLE settings ADD COLUMN ${col}`);
    } catch {
      // Column already exists
    }
  }
}
