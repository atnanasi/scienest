import client from '../src/database.ts'
import { QueryResult } from 'https://deno.land/x/postgres/query.ts'

const MIGRATIONS_TABLE = 'migrations'
const MIGRATIONS_PATH = new URL('./migrations', import.meta.url).pathname
const MIGRATION_UP = 'up.sql'
const MIGRATION_DOWN = 'down.sql'

const setUp = async (migrations: Deno.FileInfo[], migrated: QueryResult) => {
  const setUps = migrations
    .map(migration => migration.name)
    .filter(migration =>
      migrated.rows.map(value => Array.from(value).pop()).includes(migration) === false
    )

  for(const migration of setUps) {
    const filename = `${MIGRATIONS_PATH}/${migration}/${MIGRATION_UP}`
    const result = await Deno.readFile(filename)
    const query = new TextDecoder('utf-8').decode(result)
    
    console.log(`Migrating ${migration}`)
  
    await client.query(query)
  
    await client.query(
      `INSERT INTO ${MIGRATIONS_TABLE} VALUES ($1);`,
      migration
    )
  }

  console.log(`Successfully migrated`)
}

const tearDown = async (migrations: Deno.FileInfo[], migrated: QueryResult) => {
  const tearDowns = migrations
    .reverse()
    .map(migration => migration.name)
    .filter(migration =>
      migrated.rows.map(value => Array.from(value).pop()).includes(migration) === true
    )
  
  for(const migration of tearDowns) {
    const filename = `${MIGRATIONS_PATH}/${migration}/${MIGRATION_DOWN}`
    const result = await Deno.readFile(filename)
    const query = new TextDecoder('utf-8').decode(result)
    
    console.log(`Teardown ${migration}`)
  
    await client.query(query)
  
    await client.query(
      `DELETE FROM ${MIGRATIONS_TABLE} WHERE migration = $1;`,
      migration
    )
  }
  
  console.log(`Successfully migrated`)
}

await client.connect()

const tables = await client.query(
  'SELECT is_insertable_into FROM information_schema.tables WHERE table_name = $1;',
  MIGRATIONS_TABLE
)

if(tables.rows.length <= 0) {
  console.log('Creating migartion management table')
  await client.query(
    `CREATE TABLE ${MIGRATIONS_TABLE} ( migration character varying(255) PRIMARY KEY );`
  )
}

const migrated = await client.query(
  `SELECT migration FROM ${MIGRATIONS_TABLE};`
)

const migrations = await Deno.readDir(MIGRATIONS_PATH);

await setUp(migrations, migrated)

await client.end()
