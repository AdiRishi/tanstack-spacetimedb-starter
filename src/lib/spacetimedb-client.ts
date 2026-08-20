import { QueryClient } from '@tanstack/react-query'
import { SpacetimeDBQueryClient } from 'spacetimedb/tanstack'

import { DbConnection } from '@/module_bindings'

const HOST = import.meta.env.VITE_SPACETIMEDB_HOST ?? 'http://127.0.0.1:3000'
const DB_NAME = import.meta.env.VITE_SPACETIMEDB_DB_NAME ?? 'tanstack-start-spacetimedb'
const TOKEN_KEY = `${HOST}/${DB_NAME}/auth_token`

export function createSpacetimeDBRuntime() {
  const spacetimeDBQueryClient = new SpacetimeDBQueryClient()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: spacetimeDBQueryClient.queryFn,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
    },
  })
  spacetimeDBQueryClient.connect(queryClient)

  const connectionBuilder = DbConnection.builder()
    .withUri(HOST)
    .withDatabaseName(DB_NAME)
    .withToken(
      typeof localStorage !== 'undefined'
        ? (localStorage.getItem(TOKEN_KEY) ?? undefined)
        : undefined,
    )
    .onConnect((connection, _identity, token) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token)
      }
      spacetimeDBQueryClient.setConnection(connection)
    })

  return { queryClient, connectionBuilder }
}
