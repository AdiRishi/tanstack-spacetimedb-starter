import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { SpacetimeDBProvider } from 'spacetimedb/tanstack'

import { createSpacetimeDBRuntime } from '@/lib/spacetimedb-client'

import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const { connectionBuilder, queryClient } = createSpacetimeDBRuntime()

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient },
    Wrap: ({ children }) => (
      <SpacetimeDBProvider connectionBuilder={connectionBuilder}>{children}</SpacetimeDBProvider>
    ),
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
