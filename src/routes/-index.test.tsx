import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const spacetimedb = vi.hoisted(() => ({
  addPerson: vi.fn<(person: { name: string }) => Promise<void>>(() => Promise.resolve()),
  isConnected: true,
  persons: [] as Array<{ id: bigint; name: string }>,
}))

vi.mock('spacetimedb/tanstack', () => ({
  useReducer: () => spacetimedb.addPerson,
  useSpacetimeDB: () => ({ isActive: spacetimedb.isConnected }),
  useSpacetimeDBQuery: () => [spacetimedb.persons],
}))

vi.mock('@/module_bindings', () => ({
  reducers: {
    add: Symbol('add'),
  },
  tables: {
    person: Symbol('person'),
  },
}))

import { App } from './index'

describe('people route', () => {
  beforeEach(() => {
    spacetimedb.addPerson.mockResolvedValue(undefined)
    spacetimedb.isConnected = true
    spacetimedb.persons = []
  })

  it('renders the current connection state and subscribed people', () => {
    spacetimedb.persons = [
      { id: 1n, name: 'Ada Lovelace' },
      { id: 2n, name: 'Grace Hopper' },
    ]

    render(<App />)

    expect(screen.getByText('connected')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'People (2)' })).toBeInTheDocument()
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument()
  })

  it('submits a trimmed person name through the SpacetimeDB reducer', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText('Name'), '  Katherine Johnson  ')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(spacetimedb.addPerson).toHaveBeenCalledWith({ name: 'Katherine Johnson' })
    })
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })

  it('disables the form while SpacetimeDB is disconnected', async () => {
    const user = userEvent.setup()
    spacetimedb.isConnected = false

    render(<App />)

    expect(screen.getByText('disconnected')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(spacetimedb.addPerson).not.toHaveBeenCalled()
  })
})
