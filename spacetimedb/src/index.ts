import { schema, SenderError, t, table } from 'spacetimedb/server'

const person = table(
  { name: 'person', public: true },
  {
    id: t.u64().primaryKey().autoInc(),
    name: t.string(),
  },
)

const spacetimedb = schema({ person })
export default spacetimedb

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
