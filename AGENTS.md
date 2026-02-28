# CLAUDE.md

This file provides guidance to AI Agents when working with code in this repository.

## Development Commands

```bash
# Local development (2 terminals):
pnpm spacetime:start    # Terminal 1: Start local SpacetimeDB server
pnpm dev                # Terminal 2: Publish module, generate bindings, watch for changes, AND start web app

# If you prefer manual control (3 terminals):
pnpm spacetime:start          # Terminal 1: Start local SpacetimeDB server
pnpm spacetime:publish:local  # Terminal 2: Publish module to local server
pnpm spacetime:generate       # Terminal 2: Generate client bindings
pnpm dev:web                  # Terminal 3: Start web app only (http://localhost:8080)

# Build and test
pnpm build              # Build for production
pnpm test               # Run vitest
pnpm lint               # Run ESLint
pnpm check              # Run Prettier + ESLint with fixes

# SpacetimeDB
pnpm spacetime:generate       # Generate client bindings from module
pnpm spacetime:publish:local  # Publish module to local server
pnpm spacetime:publish        # Publish module to maincloud (production)
```

## Architecture

This is a full-stack TypeScript app combining:

- **TanStack Start** - File-based routing with SSR and type-safe server functions
- **SpacetimeDB 2.0** - Real-time relational database with auto-generated bindings
- **React 19** with shadcn/ui components

### Key Directories

- `src/routes/` - File-based routes (TanStack Router)
- `src/module_bindings/` - Auto-generated SpacetimeDB client bindings (DO NOT EDIT)
- `src/lib/spacetimedb-client.ts` - Module-level SpacetimeDB connection, QueryClient, and SpacetimeDBQueryClient setup
- `src/lib/app-provider.tsx` - Consolidated providers wrapper (SpacetimeDBProvider)
- `src/router.tsx` - Router config with AppProviders as Wrap, SSR query integration
- `src/components/ui/` - shadcn/ui components
- `spacetimedb/src/index.ts` - Database schema, tables, and reducers
- `spacetime.json` - SpacetimeDB project configuration (server, database name, module path)

### Data Flow

1. Tables and reducers defined in `spacetimedb/src/index.ts` using schema API
2. `pnpm dev` auto-generates client bindings to `src/module_bindings/`
3. UI subscribes to tables via `useSpacetimeDBQuery(tables.tableName)` hook from `spacetimedb/tanstack`
4. Mutations use `useReducer(reducers.reducerName)` hook, then call `addPerson({ param: value })`
5. SpacetimeDB pushes changes through `SpacetimeDBQueryClient` into React Query's cache
6. All subscribed components re-render automatically in real-time

### SpacetimeDB 2.0 Patterns

- Schema uses named object syntax: `schema({ person: table({ public: true }, { ... }) })`
- Reducers are exported named constants: `export const add = spacetimedb.reducer(...)`
- Connection uses `withDatabaseName()` (not `withModuleName()`)
- Reducer callbacks are removed — use `_then()` on individual calls or event tables
- Connection config uses env vars: `VITE_SPACETIMEDB_HOST` and `VITE_SPACETIMEDB_DB_NAME`

## MCP Servers

- **Context7** - Use for looking up documentation for TanStack Start, TanStack Router, shadcn/ui, Tailwind CSS, and other libraries. Do not use for SpacetimeDB (use the skill instead).

## Skills

- **spacetimedb** - Always use when working on SpacetimeDB logic (tables, reducers, client bindings, subscriptions)
- **frontend-design** - Always use when building or modifying UI components and pages
- **agent-browser** - Always use to visually verify work by checking the website
