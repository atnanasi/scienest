import { soxa } from 'https://deno.land/x/soxa@v0.3/mod.ts'
import $ from 'https://cdn.jsdelivr.net/gh/rokoucha/transform-ts@master/mod.ts'
import { $unixtime } from '../../utils/transformers.ts'
import EntryRepository, { Entry, NewEntry } from './index.ts'
import { SCRAPBOX_API } from '../../config.ts'

const Icons = $.obj({
  rokoucha: $.number,
})

const Line = $.obj({
  id: $.string,
  text: $.string,
  userId: $.string,
  created: $unixtime,
  updated: $unixtime,
})

const LinksHop = $.obj({
  id: $.string,
  title: $.string,
  titleLc: $.string,
  image: $.nullable($.string),
  descriptions: $.array($.string),
  linksLc: $.array($.string),
  updated: $unixtime,
  accessed: $unixtime,
})

const RelatedPages = $.obj({
  links1hop: $.array(LinksHop),
  links2hop: $.array(LinksHop),
  icons1hop: $.array($.any),
})

const User = $.obj({
  id: $.string,
  name: $.optional($.string),
  displayName: $.optional($.string),
  photo: $.optional($.string),
})

const Page = $.obj({
  id: $.string,
  title: $.string,
  image: $.nullable($.string),
  descriptions: $.array($.string),
  user: User,
  pin: $.number,
  views: $.number,
  linked: $.number,
  commitId: $.optional($.string),
  created: $unixtime,
  updated: $unixtime,
  accessed: $unixtime,
  snapshotCreated: $.nullable($.number),
  persistent: $.optional($.boolean),
  lines: $.optional($.array(Line)),
  links: $.optional($.array($.string)),
  icons: $.optional(Icons),
  relatedPages: $.optional(RelatedPages),
  collaborators: $.optional($.array($.any)),
  lastAccessed: $.optional($.number),
})

const Scrapbox = $.obj({
  projectName: $.string,
  skip: $.number,
  limit: $.number,
  count: $.number,
  pages: $.array(Page),
})

export default class ScrapboxEntryRepository extends EntryRepository {
  private endpoint: URL
  private projectName: string
  private rootTitle: string

  constructor(
    projectName: string,
    endpoint = SCRAPBOX_API,
    rootTitle = 'Home',
  ) {
    super()

    this.endpoint = new URL(endpoint)
    this.projectName = projectName
    this.rootTitle = rootTitle
  }

  private getApi(path: string): string {
    const pageName = path.startsWith('/') ? path.slice(1) : path
    return `${this.endpoint.href}/api/pages/${this.projectName}/${pageName}`
  }

  private toPath(title: string): string {
    return title === this.rootTitle ? '/' : `/${decodeURIComponent(title)}`
  }

  private toTitle(path: string): string {
    return path === '/' ? this.rootTitle : encodeURIComponent(path.substring(1))
  }

  async getEntry(path: string): Promise<Entry> {
    const entry = Page.transformOrThrow(
      (await soxa.get(this.getApi(`/${this.toTitle(path)}`))).data,
    )

    return {
      path: this.toPath(entry.title),
      body: entry.lines?.map(line => line.text).join('\n'),
      updatedAt: entry.updated,
      createdAt: entry.created,
      root: entry.title === this.rootTitle,
    }
  }

  async getEntries(): Promise<Entry[]> {
    const entries = Scrapbox.transformOrThrow(
      (await soxa.get(this.getApi('/'))).data,
    )

    return entries.pages.map(
      (entry): Entry => {
        return {
          path: this.toPath(entry.title),
          body: entry.descriptions.join('\n'),
          updatedAt: entry.updated,
          createdAt: entry.created,
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
