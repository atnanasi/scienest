export interface Entry {
  path: string
  body: string
  updatedAt: Date
  createdAt: Date
  root: boolean
}

export interface NewEntry {
  path: string
  body: string
}

export default abstract class EntryRepository {
  abstract async getEntry(path: string): Promise<Entry>
  abstract async getEntries(): Promise<Entry[]>
  abstract async createEntry(entry: NewEntry): Promise<string>
  abstract async updateEntry(path: string, entry: Entry): Promise<string>
  abstract async deleteEntry(path: string): Promise<void>
}
