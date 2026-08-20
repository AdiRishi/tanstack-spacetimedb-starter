import { DbConnection, tables } from '@/module_bindings'
import type { Person } from '@/module_bindings/types'

const HOST = process.env.SPACETIMEDB_HOST ?? 'http://127.0.0.1:3000'
const DB_NAME = process.env.SPACETIMEDB_DB_NAME ?? 'tanstack-start-spacetimedb'
const CONNECTION_TIMEOUT_MS = 10_000

export function fetchPeople(): Promise<Person[]> {
  return new Promise((resolve, reject) => {
    let connection: DbConnection | undefined
    let settled = false

    const finish = (result: Person[] | Error) => {
      if (settled) {
        return
      }

      settled = true
      clearTimeout(timeout)
      connection?.disconnect()

      if (result instanceof Error) {
        reject(result)
      } else {
        resolve(result)
      }
    }

    const timeout = setTimeout(() => {
      finish(new Error('SpacetimeDB connection timed out'))
    }, CONNECTION_TIMEOUT_MS)

    connection = DbConnection.builder()
      .withUri(HOST)
      .withDatabaseName(DB_NAME)
      .onConnect((connected) => {
        connected
          .subscriptionBuilder()
          .onApplied(() => {
            finish(Array.from(connected.db.person.iter()))
          })
          .onError((context) => {
            finish(context.event ?? new Error('SpacetimeDB subscription failed'))
          })
          .subscribe(tables.person)
      })
      .onConnectError((_context, error) => {
        finish(error)
      })
      .build()
  })
}
