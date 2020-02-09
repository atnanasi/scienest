import EntryRepository, {
  Entry,
  NewEntry,
} from '../repositories/entry/index.ts'
import PostgresEntryRepository from '../repositories/entry/postgres.ts'

const DEFAULT_REPOSITORY = PostgresEntryRepository.prototype.name

export type GetEntryOptions = { repositoryName?: string }

export interface MultiBackendEntry extends Entry {
  backend: string
  realPath: Entry['path']
}

export default class EntryModel {
  private repositories: EntryRepository[]

  constructor(repositories: EntryRepository[]) {
    this.repositories = repositories
  }

  private getRepository(name: string): EntryRepository {
    return this.repositories
      .filter(repository => repository.name === name)
      .pop()
  }

  private renameDuplicatePath(options: {
    entries: MultiBackendEntry[]
    path: Entry['path']
    backend: MultiBackendEntry['backend']
  }): Entry['path'] {
    return options.entries.find(entry => entry.path === options.path)
      ? this.renameDuplicatePath({
          entries: options.entries,
          path: `/${options.backend}_${options.path}`,
          backend: options.backend,
        })
      : options.path
  }

  public async createEntry(
    entry: NewEntry,
  ): Promise<MultiBackendEntry['path']> {
    const repository = this.getRepository(DEFAULT_REPOSITORY)

    return await repository.createEntry(entry)
  }

  public async deleteEntry(path: MultiBackendEntry['path']): Promise<void> {
    const repository = this.getRepository(DEFAULT_REPOSITORY)

    await repository.deleteEntry(path)
  }

  public async getEntries(
    args?: GetEntryOptions,
  ): Promise<MultiBackendEntry[]> {
    const repositories = args?.repositoryName
      ? [this.getRepository(args.repositoryName)]
      : this.repositories

    const entries: MultiBackendEntry[] = []

    await Promise.all(
      repositories.map(async repository => {
        const entriesInRepository = (await repository.getEntries()) as MultiBackendEntry[]

        for (const entry of entriesInRepository) {
          entry.backend = repository.name
          entry.realPath = entry.path

          entry.path = this.renameDuplicatePath({
            entries,
            path: entry.path,
            backend: entry.backend,
          })

          entries.push(entry)
        }
      }),
    )

    return entries
  }

  public async getEntry(
    path: string,
    args?: GetEntryOptions,
  ): Promise<MultiBackendEntry> {
    console.log(path)
    const entries = await this.getEntries(args)
    const foundEntry = entries.filter(entry => entry.path === path)[0]

    const repository = this.getRepository(foundEntry.backend)
    const realPath = foundEntry.path

    const entry = (await repository.getEntry(realPath)) as MultiBackendEntry

    entry.backend = repository.name
    entry.realPath = entry.path
    entry.path = this.renameDuplicatePath({
      entries,
      path: entry.path,
      backend: entry.backend,
    })

    return entry
  }

  public async updateEntry(
    path: string,
    entry: MultiBackendEntry,
  ): Promise<MultiBackendEntry['path']> {
    const repository = this.getRepository(DEFAULT_REPOSITORY)
    entry.path = entry.realPath

    return await repository.updateEntry(path, entry)
  }
}
