# Ambient Music Feature — Duck Pomodoro

## Context

Duck Pomodoro currently has no audio functionality. Users want background music/ambient sounds during focus sessions to improve concentration. The app already has a `songs/song_rain.m4a` file ready for use.

## Requirements

1. **Built-in ambient sounds** bundled with the app (starting with rain; more can be added later)
2. **Import local audio files** (MP3, WAV, M4A, OGG) from user's computer
3. Music plays **only during work/focus sessions** — auto-stops on break, pause, or stop
4. **Loop continuously** during the session
5. **Volume control** with persistence
6. User can **select which sound** to play from settings

## Architecture: Web Audio + Tauri Asset Protocol

### Audio Playback

A new `useAmbientSound` hook manages an HTML5 `Audio` element. It receives `timerState` and `sessionType` from `useTimer` and reacts via `useEffect`:

| timerState | sessionType | Audio action |
|------------|-------------|-------------|
| `running`  | `work`      | `play()`    |
| `paused`   | any         | `pause()`   |
| `idle`     | any         | `stop()` (pause + currentTime = 0) |
| any        | `short_break` / `long_break` | `stop()` |

`Audio.loop = true` ensures continuous looping.

### Built-in Sounds

Files in `songs/` are bundled as Tauri resources via `tauri.conf.json`:

```json
{
  "bundle": {
    "resources": ["songs/*"]
  }
}
```

At runtime, resolve paths with `resolveResource("songs/song_rain.m4a")` and convert to asset protocol URLs with `convertFileSrc()`.

Built-in sounds registry (in code):

```typescript
const BUILT_IN_SOUNDS = [
  { id: "rain", name: "Chuva", file: "songs/song_rain.m4a" },
  // Future: { id: "lofi", name: "Lo-Fi", file: "songs/song_lofi.m4a" },
  // Future: { id: "whitenoise", name: "Ruido Branco", file: "songs/song_whitenoise.m4a" },
] as const;
```

### User File Import

1. `@tauri-apps/plugin-dialog` opens a file picker filtered to audio formats
2. `@tauri-apps/plugin-fs` copies the selected file to `appDataDir/sounds/<uuid>_<original_name>`
3. Metadata is saved to the `user_sounds` SQLite table
4. Playback uses asset protocol URL from the copied file path

### Database Changes

**New columns on `settings` table** (via ALTER TABLE in `database.ts` migration):

```sql
ALTER TABLE settings ADD COLUMN sound_enabled INTEGER DEFAULT 0;
ALTER TABLE settings ADD COLUMN sound_source TEXT DEFAULT 'rain';
ALTER TABLE settings ADD COLUMN sound_volume REAL DEFAULT 0.7;
```

- `sound_source`: built-in sound ID (e.g., `"rain"`) or `"custom:<id>"` for user imports
- `sound_volume`: float 0.0–1.0

**New `user_sounds` table:**

```sql
CREATE TABLE IF NOT EXISTS user_sounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  filename TEXT NOT NULL,
  original_path TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### New Tauri Plugins

**Rust (`src-tauri/Cargo.toml`):**
- `tauri-plugin-dialog`
- `tauri-plugin-fs`

**Frontend (`package.json`):**
- `@tauri-apps/plugin-dialog`
- `@tauri-apps/plugin-fs`

**Plugin registration (`src-tauri/src/lib.rs`):**
```rust
.plugin(tauri_plugin_dialog::init())
.plugin(tauri_plugin_fs::init())
```

**Permissions (`src-tauri/capabilities/default.json`):**
```json
"dialog:default",
"dialog:allow-open",
"fs:default",
"fs:allow-read",
"fs:allow-write",
"fs:allow-exists",
"fs:allow-mkdir",
"fs:allow-copy-file"
```

**Asset protocol scope (`src-tauri/tauri.conf.json`):**
Configure security scope to allow serving files from `appDataDir/sounds/` and bundled resources.

### New Files

| File | Purpose |
|------|---------|
| `src/hooks/useAmbientSound.ts` | Core hook — manages Audio element, reacts to timer state |
| `src/hooks/useUserSounds.ts` | CRUD for user-imported sounds (list, import, delete) |
| `src/lib/sounds.ts` | Built-in sound registry, URL resolution helpers, file import logic |

### UI Changes

**SettingsPage (`src/pages/SettingsPage.tsx`):**
New "Musica" section with:
- Toggle switch: enable/disable ambient sound
- Dropdown: select sound (built-in + user imports)
- Volume slider (0–100%)
- "Importar Musica" button → opens file picker
- List of imported sounds with delete option

**PomodoroPage (`src/pages/PomodoroPage.tsx`):**
- Small volume/mute icon button near the timer controls
- Shows current sound name on hover/tooltip
- Quick mute toggle without going to settings

## Verification

1. **Built-in sound plays on focus start**: Start a work session → rain sound should play
2. **Auto-stops on break**: Let timer finish → sound stops when break starts
3. **Pause/resume**: Pause timer → sound pauses. Resume → sound resumes
4. **Stop**: Stop timer → sound stops completely
5. **Volume control**: Adjust slider in settings → volume changes in real-time
6. **Import file**: Import an MP3 → appears in dropdown, can be selected and played
7. **Persistence**: Close and reopen app → sound preferences are preserved
8. **Mute toggle**: Click mute icon on timer page → sound mutes without changing settings
