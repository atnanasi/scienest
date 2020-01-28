import { soxa } from 'https://deno.land/x/soxa/mod.ts'
import EntryRepository, { Entry, NewEntry } from '../entry.ts'

interface Scrapbox {
  projectName: string
  skip: number
  limit: number
  count: number
  pages: Page[]
}

interface Page {
  id: string
  title: string
  image: null | string
  descriptions: string[]
  user: User
  pin: number
  views: number
  linked: number
  commitId?: string
  created: number
  updated: number
  accessed: number
  snapshotCreated: number | null
  persistent?: boolean
  lines?: Line[]
  links?: string[]
  icons?: Icons
  relatedPages?: RelatedPages
  collaborators?: any[]
  lastAccessed?: number
}

interface Icons {
  rokoucha: number
}

interface Line {
  id: string
  text: string
  userId: string
  created: number
  updated: number
}

interface RelatedPages {
  links1hop: LinksHop[]
  links2hop: LinksHop[]
  icons1hop: any[]
}

interface LinksHop {
  id: string
  title: string
  titleLc: string
  image: null | string
  descriptions: string[]
  linksLc: string[]
  updated: number
  accessed: number
}

interface User {
  id: string
  name: string
  displayName: string
  photo: string
}

export default class ScrapboxEntryRepository extends EntryRepository {
  private endpoint: URL
  private projectName: string
  private rootTitle: string

  constructor(
    projectName: string,
    rootTitle = 'Home',
    endpoint = 'https://scrapbox.io/',
  ) {
    super()

    this.endpoint = new URL(endpoint)
    this.projectName = projectName
    this.rootTitle = rootTitle
  }

  private getApi(path: string): string {
    const absolutePath = path.startsWith('/') ? path : `/${path}`
    return `${this.endpoint.href}api/pages/${this.projectName}${absolutePath}`
  }

  private toPath(title: string): string {
    return title === this.rootTitle ? '/' : `/${decodeURIComponent(title)}`
  }

  private toTitle(path: string): string {
    return path === '/' ? this.rootTitle : encodeURIComponent(path.substring(1))
  }

  async getEntry(path: string): Promise<Entry> {
    const entry: Page = (await soxa.get(this.getApi(`/${this.toTitle(path)}`)))
      .data

    return {
      path: this.toPath(entry.title),
      body: entry.lines?.map(line => line.text).join('\n'),
      updatedAt: new Date(entry.updated * 1000),
      createdAt: new Date(entry.created * 1000),
      root: entry.title === this.rootTitle,
    }
  }

  async getEntries(): Promise<Entry[]> {
    const entries: Scrapbox = (await soxa.get(this.getApi('/'))).data

    return entries.pages.map(
      (entry): Entry => {
        return {
          path: this.toPath(entry.title),
          body: entry.descriptions.join('\n'),
          updatedAt: new Date(entry.updated * 1000),
          createdAt: new Date(entry.created * 1000),
          root: entry.title === this.rootTitle,
        }
      },
    )
  }

  async createEntry(entry: NewEntry): Promise<string> {
    return ''
  }

  async updateEntry(path: string, entry: Entry): Promise<string> {
    return ''
  }

  async deleteEntry(path: string): Promise<void> {}
}
