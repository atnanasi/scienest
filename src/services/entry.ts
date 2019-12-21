import client from '../database.ts'
import { Entry, NewEntry } from '../models/entry.ts'

/**
 * Get a entry with id
 * 
 * @param id id of entry
 */
export const getEntry = async (path: string): Promise<Entry> => {
  const entries = await client.query(
    'SELECT * FROM entries WHERE path = $1',
    path
  )

  if(entries.rows.length < 1) throw new Error('Entry not found')

  return entries.rows.map((entry): Entry => {
    return {
      path: entry.shift(),
      body: entry.shift(),
      updatedAt: entry.shift(),
      createdAt: entry.shift(),
      root: entry.shift()
    }
  }).shift()
}

/**
 * Get entries
 */
export const getEntries = async (): Promise<Entry[]> => {
  const entries = await client.query(
    'SELECT * FROM entries'
  )

  return entries.rows.map((entry): Entry => {
    return {
      path: entry.shift(),
      body: entry.shift(),
      updatedAt: entry.shift(),
      createdAt: entry.shift(),
      root: entry.shift()
    }
  })
}

/**
 * Create entry to entries
 * 
 * @param entry new entry
 */
export const createEntry = async (entry: NewEntry): Promise<Entry> => {
  await client.query(
    'INSERT INTO "entries" ("path", "body") VALUES ($1, $2);',
    entry.path,
    entry.body
  )

  return (await getEntry(entry.path))
}

/**
 * Update entry in entries
 * 
 * @param path entry path
 * @param entry entry
 */
export const updateEntry = async (path: string, entry: Entry): Promise<void> => {
  await client.query(
    'UPDATE "entries" SET "path" = $1, "body" = $2, "updated_at" = now() WHERE "path" = $3;',
    entry.path,
    entry.body,
    path
  )
}

/**
 * Delete entry from entries
 * 
 * @param path entry path
 */
export const deleteEntry = async (path: string): Promise<void> => {
  await client.query(
    'DELETE FROM "entries" WHERE (("path" = $1));',
    path
  )
}
