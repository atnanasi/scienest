import { Client } from 'https://deno.land/x/postgres/mod.ts'
import { QueryResult } from 'https://deno.land/x/postgres/query.ts'
import EntryRepository, { Entry, NewEntry, GetEntryOptions } from './index.ts'

export default class PostgresEntryRepository extends EntryRepository {
  private client: Client

  constructor(options: { client: Client }) {
    super()
    this.client = options.client
  }

  get name() {
    return 'PostgreSQL'
  }

  async getEntry(
    path: Entry['path'],
    options?: GetEntryOptions,
  ): Promise<Entry> {
    let entries: QueryResult

    if (options?.scope) {
      entries = await this.client.query(
        'SELECT * FROM entries WHERE path = $1 AND scope_private = $2 AND scope_unlisted = $3;',
        path,
        options.scope === 'private',
        options.scope === 'unlisted',
      )
    } else {
      entries = await this.client.query(
        'SELECT * FROM entries WHERE path = $1;',
        path,
      )
    }

    if (entries.rows.length < 1) throw new Error('Entry not found')

    return entries.rows
      .map(
        (entry): Entry => {
          const entryObject: Entry = {
            path: entry.shift(),
            body: {
              plain: entry.shift(),
              html: '',
            },
            updatedAt: entry.shift(),
            createdAt: entry.shift(),
            root: entry.shift(),
            scope:
              entry.shift() === true
                ? 'private'
                : entry.shift() === true
                ? 'unlisted'
                : 'private',
          }
          entryObject.body.html = entryObject.body.plain
          return entryObject
        },
      )
      .shift()
  }

  async getEntries(options?: GetEntryOptions): Promise<Entry[]> {
    let entries: QueryResult

    if (options?.scope) {
      entries = await this.client.query(
        'SELECT * FROM entries WHERE scope_private = $2 AND scope_unlisted = $3;',
        options.scope === 'private',
        options.scope === 'unlisted',
      )
    } else {
      entries = await this.client.query('SELECT * FROM entries;')
    }

    return entries.rows.map(
      (entry): Entry => {
        const entryObject: Entry = {
          path: entry.shift(),
          body: {
            plain: entry.shift(),
            html: '',
          },
          updatedAt: entry.shift(),
          createdAt: entry.shift(),
          root: entry.shift(),
          scope: entry.shift()
            ? 'private'
            : entry.shift()
            ? 'unlisted'
            : 'public',
        }

        entryObject.body.html = entryObject.body.plain
        return entryObject
      },
    )
  }

  async createEntry(entry: NewEntry): Promise<string> {
    await this.client.query(
      'INSERT INTO "entries" ("path", "body", "scope_private", "scope_unlisted") VALUES ($1, $2, $3, $4);',
      entry.path,
      entry.body,
      entry.scope === 'private',
      entry.scope === 'unlisted',
    )

    return entry.path
  }

  async updateEntry(path: string, entry: Entry): Promise<string> {
    await this.client.query(
      'UPDATE "entries" SET "path" = $1, "body" = $2, "scope_private" = $3, "scope_unlisted" = $4, "updated_at" = now() WHERE "path" = $5;',
      entry.path,
      entry.body,
      entry.scope === 'private',
      entry.scope === 'unlisted',
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
