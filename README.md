# TanStack Start + shadcn/ui + SpacetimeDB

A production-ready starter template for building modern, real-time full-stack applications.

## Tech Stack

- **TanStack Start** - Full-stack React framework with file-based routing, SSR, and type-safe server functions
- **shadcn/ui** - Beautiful, accessible UI components built on Radix primitives
- **SpacetimeDB** - Real-time relational database with auto-generated TypeScript bindings

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [SpacetimeDB CLI](https://spacetimedb.com/docs/getting-started)

### Installation

```bash
pnpm install
```

### Development

You'll need **two terminals**:

**Terminal 1: Start SpacetimeDB server**

```bash
pnpm spacetime:start
```

**Terminal 2: Start everything else**

```bash
pnpm dev
```

This publishes the module, generates client bindings, watches for changes, and starts the web app.

Open [http://localhost:8080](http://localhost:8080)

## Project Layout

- `src/routes/` - File-based routes (TanStack Router)
- `src/components/ui/` - shadcn/ui components
- `src/module_bindings/` - Auto-generated SpacetimeDB client bindings
- `src/lib/spacetimedb-client.ts` - SpacetimeDB connection and React Query setup
- `spacetimedb/src/index.ts` - SpacetimeDB server module (tables and reducers)

## Scripts

| Script                   | Description                              |
| ------------------------ | ---------------------------------------- |
| `pnpm dev`               | Publish module, watch, and start web app |
| `pnpm dev:web`           | Start web app only                       |
| `pnpm build`             | Build for production                     |
| `pnpm test`              | Run tests                                |
| `pnpm lint`              | Lint code                                |
| `pnpm format`            | Format code                              |
| `pnpm spacetime:start`   | Start local SpacetimeDB server only      |
| `pnpm spacetime:publish` | Deploy to SpacetimeDB cloud              |

## Learn More

- [TanStack Start](https://tanstack.com/start)
- [SpacetimeDB](https://spacetimedb.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## License

MIT
