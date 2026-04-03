# Duck Pomodoro

Aplicativo de foco estilo Pomodoro feito com **React + Vite + Tauri**.

O projeto inclui:
- app desktop (`/`) com timer, tarefas, histórico, estatísticas e configurações
- landing page (`/landing`) em Next.js

## Funcionalidades

- Timer Pomodoro com ciclos de foco, pausa curta e pausa longa
- Modo simples e modo vinculado a tarefa
- Gerenciamento de tarefas
- Histórico de sessões e estatísticas
- Configurações de duração e ciclo
- Som ambiente embutido e importação de músicas personalizadas
- Persistência local com SQLite (Tauri Plugin SQL)

## Stack

- Frontend desktop: React 19 + TypeScript + Vite
- Shell desktop: Tauri 2 (Rust)
- Banco local: SQLite (`duck_pomodoro.db`)
- Landing: Next.js 16 + React 19

## Requisitos

- Node.js 20+ e npm
- Rust + Cargo
- Dependências de sistema para Tauri (Linux/macOS/Windows)

## Instalação

```bash
npm install
cd landing && npm install
```

## Rodando o projeto

### App web (Vite)

```bash
npm run dev
```

### App desktop (Tauri)

```bash
npm run tauri dev
```

### Landing page

```bash
cd landing
npm run dev
```

## Build

```bash
npm run build
npm run tauri build
```

Builds específicos:

```bash
npm run build:linux
npm run build:windows
```

## Scripts principais (raiz)

- `npm run dev`: inicia frontend Vite
- `npm run build`: build frontend
- `npm run preview`: preview do build web
- `npm run tauri <cmd>`: repassa comandos para o Tauri CLI

## Estrutura

```text
.
├── src/                 # frontend do app desktop
├── src-tauri/           # backend Rust + config Tauri
├── public/sounds/       # sons embutidos (copiados no bundle)
├── landing/             # landing page em Next.js
└── docs/                # documentos e specs
```

## Observações

- Sons embutidos ficam em `public/sounds`.
- Em build desktop, os sons são incluídos via `src-tauri/tauri.conf.json`.
- Músicas importadas pelo usuário são salvas no diretório de dados do app.
