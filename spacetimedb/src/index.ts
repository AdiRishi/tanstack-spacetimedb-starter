import { schema, SenderError, t, table } from 'spacetimedb/server'

const spacetimedb = schema({
  person: table(
    { public: true },
    {
      id: t.u64().primaryKey().autoInc(),
      name: t.string(),
    },
  ),
})
export default spacetimedb

export const init = spacetimedb.init((_ctx) => {
  // Called when the module is initially published
})

export const onConnect = spacetimedb.clientConnected((_ctx) => {
  // Called every time a new client connects
  console.log('Client connected', _ctx.connectionId?.__connection_id__)
})

export const onDisconnect = spacetimedb.clientDisconnected((_ctx) => {
  // Called every time a client disconnects
  console.log('Client disconnected', _ctx.connectionId?.__connection_id__)
})

export const add = spacetimedb.reducer({ name: t.string() }, (ctx, { name }) => {
  const trimmed = name.trim()
  if (!trimmed) {
    throw new SenderError('name must not be empty')
  }
  ctx.db.person.insert({ id: 0n, name: trimmed })
})

export const sayHello = spacetimedb.reducer((ctx) => {
  for (const person of ctx.db.person.iter()) {
    console.info(`Hello, ${person.name}!`)
  }
  console.info('Hello, World!')
})
