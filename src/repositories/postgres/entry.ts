import { Client } from 'https://deno.land/x/postgres/mod.ts'
import EntryRepository, { Entry, NewEntry } from '../entry.ts'

export default class PostgresEntryRepository extends EntryRepository {
  private client: Client

  constructor(client: Client) {
    super()
    this.client = client
  }

  async getEntry(path: string): Promise<Entry> {
    const entries = await this.client.query(
      'SELECT * FROM entries WHERE path = $1',
      path,
    )

    if (entries.rows.length < 1) throw new Error('Entry not found')

    return entries.rows
      .map(
        (entry): Entry => {
          return {
            path: entry.shift(),
            body: entry.shift(),
            updatedAt: entry.shift(),
            createdAt: entry.shift(),
            root: entry.shift(),
          }
        },
      )
      .shift()
  }

  async getEntries(): Promise<Entry[]> {
    const entries = await this.client.query('SELECT * FROM entries')

    return entries.rows.map(
      (entry): Entry => {
        return {
          path: entry.shift(),
          body: entry.shift(),
          updatedAt: entry.shift(),
          createdAt: entry.shift(),
          root: entry.shift(),
        }
      },
    )
  }

  async createEntry(entry: NewEntry): Promise<string> {
    await this.client.query(
      'INSERT INTO "entries" ("path", "body") VALUES ($1, $2);',
      entry.path,
      entry.body,
    )

    return entry.path
  }

  async updateEntry(path: string, entry: Entry): Promise<string> {
    await this.client.query(
      'UPDATE "entries" SET "path" = $1, "body" = $2, "updated_at" = now() WHERE "path" = $3;',
      entry.path,
      entry.body,
      path,
    )

    return entry.path
  }

  async deleteEntry(path: string): Promise<void> {
    await this.client.query(
      'DELETE FROM "entries" WHERE (("path" = $1));',
      path,
    )
  }
}
