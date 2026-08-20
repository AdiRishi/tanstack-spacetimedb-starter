import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const spacetimedb = vi.hoisted(() => ({
  addPerson: vi.fn<(person: { name: string }) => Promise<void>>(() => Promise.resolve()),
  connectionError: undefined as Error | undefined,
  isConnected: true,
  isLoading: false,
  persons: [] as Array<{ id: bigint; name: string }>,
  queryError: undefined as Error | undefined,
}))

vi.mock('spacetimedb/tanstack', () => ({
  spacetimeDBQuery: () => ({
    queryKey: ['spacetimedb', 'person', 'SELECT * FROM person'],
    staleTime: Infinity,
  }),
  useReducer: () => spacetimedb.addPerson,
  useSpacetimeDB: () => ({
    connectionError: spacetimedb.connectionError,
    isActive: spacetimedb.isConnected,
  }),
  useSpacetimeDBQuery: () => [
    spacetimedb.persons,
    spacetimedb.isLoading,
    {
      error: spacetimedb.queryError,
      isError: spacetimedb.queryError !== undefined,
    },
  ],
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
    spacetimedb.connectionError = undefined
    spacetimedb.isConnected = true
    spacetimedb.isLoading = false
    spacetimedb.persons = []
    spacetimedb.queryError = undefined
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

  it('keeps the entered name and reports reducer failures', async () => {
    const user = userEvent.setup()
    spacetimedb.addPerson.mockRejectedValueOnce(new Error('name was rejected'))

    render(<App />)

    await user.type(screen.getByLabelText('Name'), 'Ada')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('name was rejected')
    expect(screen.getByLabelText('Name')).toHaveValue('Ada')
  })

  it('does not report an empty table while the first subscription is loading', () => {
    spacetimedb.isLoading = true

    render(<App />)

    expect(screen.getByText('Loading people...')).toBeInTheDocument()
    expect(screen.queryByText('No people yet.')).not.toBeInTheDocument()
  })
})
