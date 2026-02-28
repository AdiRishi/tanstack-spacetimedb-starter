import { createFileRoute } from '@tanstack/react-router'
import { type SubmitEvent, useState } from 'react'
import { useReducer, useSpacetimeDB, useSpacetimeDBQuery } from 'spacetimedb/tanstack'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { reducers, tables } from '@/module_bindings'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { isActive: isConnected } = useSpacetimeDB()
  const addPerson = useReducer(reducers.add)
  const [persons] = useSpacetimeDBQuery(tables.person)
  const [name, setName] = useState('')

  const submitPerson = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextName = name.trim()
    if (!nextName || !isConnected) {
      return
    }

    addPerson({ name: nextName })
    setName('')
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
      </section>

      <form onSubmit={submitPerson} className="space-y-2 rounded-lg border bg-card p-4">
        <Label htmlFor="person-name">Name</Label>
        <div className="flex gap-2">
          <Input
            id="person-name"
            value={name}
            onValueChange={setName}
            placeholder="Ada Lovelace"
            disabled={!isConnected}
          />
          <Button type="submit" disabled={!isConnected || !name.trim()}>
            Add
          </Button>
        </div>
      </form>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          People ({persons.length})
        </h2>
        {persons.length === 0 ? (
          <p className="text-sm text-muted-foreground">No people yet.</p>
        ) : (
          <ul className="space-y-2">
            {persons.map((person, index) => (
              <li key={`${person.name}-${index}`} className="rounded-md border px-3 py-2 text-sm">
                {person.name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
