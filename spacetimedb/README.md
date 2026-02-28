# SpacetimeDB Module

This folder contains the SpacetimeDB server module - your database schema and reducers.

## Structure

- `src/index.ts` - Tables and reducers
- `dist/` - Compiled output (generated)

## Development

```bash
# From project root
pnpm spacetime:start  # Terminal 1: Start local SpacetimeDB server
pnpm dev              # Terminal 2: Publish, generate bindings, watch, and start web app
```

Changes to `src/index.ts` will auto-sync to the local server and regenerate client bindings in `src/module_bindings/`.

## Docs

[SpacetimeDB TypeScript SDK](https://spacetimedb.com/docs/sdks/typescript)
