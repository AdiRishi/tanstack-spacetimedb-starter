# Tanstack SpacetimeDB Starter

**Full-stack real-time apps with type-safe routing, reactive database sync, and zero boilerplate.**

[![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.x-blue?logo=react)](https://tanstack.com/start)
[![SpacetimeDB](https://img.shields.io/badge/SpacetimeDB-2.x-purple)](https://spacetimedb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Uses pnpm](https://img.shields.io/badge/pnpm-10.x-orange?logo=pnpm)](https://pnpm.io/)

## What's included

- **[TanStack Start](https://tanstack.com/start)** — full-stack React meta-framework with type-safe routing and server functions
- **[SpacetimeDB](https://spacetimedb.com)** — real-time database with server-side reducers and automatic client sync
- **End-to-end type safety** — server schema changes auto-generate client bindings, no manual API layer
- **[Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)** — utility-first styling with accessible component primitives
- **React 19** — latest React with TanStack Query and Router devtools
- **Strict TypeScript, ESLint, Prettier** — opinionated DX with import and Tailwind class sorting
- **[Claude Code](https://claude.ai/code) skills** — AI-assisted development with context-aware guidance

## Prerequisites

- Node.js 20+ (LTS)
- pnpm 10.x (pinned via `packageManager` in `package.json`)
- [SpacetimeDB CLI](https://spacetimedb.com/install)

## Quick start

**1. Clone and install:**

```bash
npx degit AdiRishi/tanstack-spacetimedb-starter my-app
cd my-app
pnpm install
```

**2. Start SpacetimeDB** (first terminal):

```bash
pnpm spacetime:start
```

**3. Start dev** (second terminal) — publishes the server module, generates client bindings, and starts Vite:

```bash
pnpm dev
```

The app runs at `http://localhost:8080`.

## Tech stack

| Layer     | Technology                                  |
| --------- | ------------------------------------------- |
| Framework | TanStack Start (React 19 + Vite 7)          |
| Routing   | TanStack Router (type-safe, file-based)     |
| Data      | TanStack Query + SpacetimeDB reactive hooks |
| Database  | SpacetimeDB (TypeScript server modules)     |
| Styling   | Tailwind CSS v4 + shadcn/ui                 |
| Testing   | Vitest + Testing Library                    |
| Language  | TypeScript 5.9 (strict)                     |

## Project structure

```
spacetimedb/
  src/index.ts                → Table definitions and server reducers
src/
  routes/                     → File-based routes (TanStack Router)
  components/ui/              → shadcn/ui primitives (button, input, label)
  lib/
    spacetimedb-client.ts     → DB connection and TanStack Query integration
    app-provider.tsx          → SpacetimeDB + Query provider wrapper
  module_bindings/            → Auto-generated client types (do not edit)
  global-styles/tailwind.css  → Theme tokens — edit this to customize your app
```

## How it works

Define tables and reducers in `spacetimedb/src/index.ts`. When you run `pnpm dev`, SpacetimeDB compiles your module, publishes it to the local server, and auto-generates type-safe client bindings in `src/module_bindings/`.

On the client, use the reactive hooks from `spacetimedb/tanstack`:

```tsx
const people = useSpacetimeDBQuery(tables.person) // subscribes to live data
const addPerson = useReducer(reducers.add) // calls server reducers
const { isConnected } = useSpacetimeDB() // connection status
```

Changes sync in real-time — no REST endpoints, no GraphQL, no manual cache invalidation.

## Scripts

| Command                   | Description                             |
| ------------------------- | --------------------------------------- |
| `pnpm dev`                | Full dev environment (DB + web)         |
| `pnpm dev:web`            | Vite dev server only                    |
| `pnpm build`              | Production build                        |
| `pnpm test`               | Run tests                               |
| `pnpm typecheck`          | Type check with tsc                     |
| `pnpm check`              | Format + lint with auto-fix             |
| `pnpm spacetime:generate` | Regenerate client bindings              |
| `pnpm spacetime:publish`  | Publish module to SpacetimeDB maincloud |

## Resources

- [TanStack Start docs](https://tanstack.com/start)
- [SpacetimeDB docs](https://spacetimedb.com/docs)
- [SpacetimeDB TypeScript SDK](https://spacetimedb.com/docs/sdks/typescript)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
