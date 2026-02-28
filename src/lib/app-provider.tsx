import { SpacetimeDBProvider } from 'spacetimedb/tanstack'

import { connectionBuilder } from '@/lib/spacetimedb-client'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <SpacetimeDBProvider connectionBuilder={connectionBuilder}>{children}</SpacetimeDBProvider>
}
