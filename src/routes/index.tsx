import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type SubmitEvent, useState } from 'react'
import {
  spacetimeDBQuery,
  useReducer,
  useSpacetimeDB,
  useSpacetimeDBQuery,
} from 'spacetimedb/tanstack'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchPeople } from '@/lib/spacetimedb-server'
import { reducers, tables } from '@/module_bindings'

const getPeople = createServerFn({ method: 'GET' }).handler(fetchPeople)

export const Route = createFileRoute('/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      ...spacetimeDBQuery(tables.person),
      queryFn: getPeople,
    }),
  component: App,
})

export function App() {
  const { connectionError, isActive: isConnected } = useSpacetimeDB()
  const addPerson = useReducer(reducers.add)
  const [persons, isLoading, peopleQuery] = useSpacetimeDBQuery(tables.person)
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>()

  const submitPerson = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextName = name.trim()
    if (!nextName || !isConnected) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(undefined)

    try {
      await addPerson({ name: nextName })
      setName('')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not add person')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 px-6 py-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">People</h1>
        <p className="text-sm text-muted-foreground">
          Tiny TanStack Start + SpacetimeDB demo with one table and one reducer.
        </p>
        <p className="text-sm">
          Connection:{' '}
          <span className={isConnected ? 'text-emerald-600' : 'text-red-600'}>
            {isConnected ? 'connected' : 'disconnected'}
          </span>
        </p>
        {connectionError ? (
          <p role="alert" className="text-sm text-red-600">
            Connection error: {connectionError.message}
          </p>
        ) : null}
      </section>

      <form onSubmit={submitPerson} className="space-y-2 rounded-lg border bg-card p-4">
        <Label htmlFor="person-name">Name</Label>
        <div className="flex gap-2">
          <Input
            id="person-name"
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value)
              setSubmitError(undefined)
            }}
            placeholder="Ada Lovelace"
            disabled={!isConnected || isSubmitting}
          />
          <Button type="submit" disabled={!isConnected || !name.trim() || isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        </div>
        {submitError ? (
          <p role="alert" className="text-sm text-red-600">
            {submitError}
          </p>
        ) : null}
      </form>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          People ({persons.length})
        </h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading people...</p>
        ) : peopleQuery.isError ? (
          <p role="alert" className="text-sm text-red-600">
            Could not load people: {peopleQuery.error.message}
          </p>
        ) : persons.length === 0 ? (
          <p className="text-sm text-muted-foreground">No people yet.</p>
        ) : (
          <ul className="space-y-2">
            {persons.map((person) => (
              <li key={person.id} className="rounded-md border px-3 py-2 text-sm">
                {person.name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
