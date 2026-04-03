# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (starts Vite dev server + Tauri window)
npm run tauri dev

# Type check only (fast)
npx tsc --noEmit

# Frontend build only
npm run build

# Full production build (generates .deb, .rpm, .AppImage in src-tauri/target/release/bundle/)
npx tauri build

# Regenerate all icon sizes from a source PNG
npx tauri icon src-tauri/icons/icon.png
```

## Architecture

This is a **Tauri 2.x** desktop app: a React/Vite frontend communicating with a Rust backend via Tauri's IPC bridge.

### Frontend (`src/`)

**Data flow:** `App.tsx` initializes the SQLite DB and owns top-level state, passing data and callbacks down to pages. Pages are swapped via `useState<Page>` — no router.

**Layers:**
- `lib/database.ts` — singleton `getDb()` that lazily connects to SQLite and runs CREATE TABLE migrations on first call. All DB access goes through this.
- `lib/types.ts` — all shared TypeScript types, plus `SESSION_LABELS` and `SESSION_COLORS` constants keyed by `SessionType`.
- `hooks/useTimer.ts` — the core logic. Timer runs via `setInterval` in the browser (desktop webviews don't throttle intervals). On session end it: sends a native notification, logs to `pomodoro_sessions`, increments `tasks.total_pomodoros` if task-linked, then auto-transitions to the next session type.
- `hooks/use*.ts` — each hook owns its DB queries and exposes a `reload()` so parent components can trigger refetches after mutations.

**No custom Rust commands for CRUD** — all database reads/writes happen from the frontend via `@tauri-apps/plugin-sql`.

### Rust backend (`src-tauri/src/`)

Only two concerns:
1. `tray.rs` — creates the system tray with `TrayIconBuilder`. Left-click shows the window; menu has "Mostrar Janela" and "Sair".
2. `lib.rs` — registers plugins (`tauri-plugin-sql`, `tauri-plugin-notification`), calls `create_tray()`, and intercepts `CloseRequested` to hide the window instead of quitting (`api.prevent_close()`).

### Styling

Tailwind v4 with `@theme` in `src/index.css`. Custom tokens map directly to utility classes:
- `--color-surface` → `bg-surface`, `--color-text-primary` → `text-text-primary`, etc.
- When Tailwind classes don't apply to native elements (e.g. `<select>`), use `style={{ colorScheme: "dark", backgroundColor: "var(--color-surface)" }}` inline.

### Database schema

All migrations run inline in `database.ts`:
- `settings` — singleton row (id=1), stores durations in **seconds**
- `tasks` — user-created goals, tracks `total_pomodoros` count
- `pomodoro_sessions` — every session start/stop, `task_id` nullable (simple mode), `completed=0` means interrupted

### Capabilities

Tauri permissions are in `src-tauri/capabilities/default.json`. Any new Tauri plugin requires adding its permission identifiers there.
