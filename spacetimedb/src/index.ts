import { schema, t, table } from 'spacetimedb/server'

const spacetimedb = schema({
  person: table(
    { public: true },
    {
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
  ctx.db.person.insert({ name })
})

export const sayHello = spacetimedb.reducer((ctx) => {
  for (const person of ctx.db.person.iter()) {
    console.info(`Hello, ${person.name}!`)
  }
  console.info('Hello, World!')
})
