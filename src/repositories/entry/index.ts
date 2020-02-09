export interface Entry {
  body: {
    html: string
    plain: string
  }
  createdAt: Date
  path: string
  root: boolean
  scope: 'public' | 'unlisted' | 'private'
  updatedAt: Date
}

export interface NewEntry {
  body: Entry['body']['plain']
  path: Entry['path']
  scope: Entry['scope']
}

export interface GetEntryOptions {
  scope?: Entry['scope']
}

export default abstract class EntryRepository {
  abstract async createEntry(entry: NewEntry): Promise<string>
  abstract async deleteEntry(path: string): Promise<void>
  abstract async getEntries(options?: GetEntryOptions): Promise<Entry[]>
  abstract async getEntry(
    path: string,
    options?: GetEntryOptions,
  ): Promise<Entry>
  abstract async updateEntry(path: string, entry: Entry): Promise<string>
  abstract get name(): string
}
