import { QueryClient } from '@tanstack/react-query'
import { type Identity } from 'spacetimedb'
import { SpacetimeDBQueryClient } from 'spacetimedb/tanstack'

import { DbConnection, type ErrorContext } from '@/module_bindings'

const HOST = import.meta.env.VITE_SPACETIMEDB_HOST ?? 'http://127.0.0.1:3000'
const DB_NAME = import.meta.env.VITE_SPACETIMEDB_DB_NAME ?? 'tanstack-start-spacetimedb'
const TOKEN_KEY = `${HOST}/${DB_NAME}/auth_token`

export const spacetimeDBQueryClient = new SpacetimeDBQueryClient()

// QueryClient must be created per getRouter() call: TanStack Start calls the
// router factory once per SSR request, and a shared cache would leak data
// across requests. The SpacetimeDB singletons above are browser-only (WebSocket)
// and safe to share.
export function createQueryClient() {
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
  return queryClient
}

const onConnect = (conn: DbConnection, identity: Identity, token: string) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
  console.log('Connected to SpacetimeDB with identity:', identity.toHexString())
  spacetimeDBQueryClient.setConnection(conn)
}

const onDisconnect = () => {
  console.log('Disconnected from SpacetimeDB')
}

const onConnectError = (_ctx: ErrorContext, err: Error) => {
  console.error('Error connecting to SpacetimeDB:', err)
}

export const connectionBuilder = DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  .withToken(
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem(TOKEN_KEY) ?? undefined)
      : undefined,
  )
  .onConnect(onConnect)
  .onDisconnect(onDisconnect)
  .onConnectError(onConnectError)
