import { soxa } from 'https://deno.land/x/soxa@v0.3/mod.ts'
import $ from 'https://cdn.jsdelivr.net/gh/rokoucha/transform-ts@master/mod.ts'
import { $unixtime } from '../../utils/transformers.ts'
import EntryRepository, { Entry, NewEntry } from './index.ts'

const Icons = $.obj({
  rokoucha: $.optional($.number),
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
  private scope: Entry['scope']

  constructor(options: {
    projectName: string
    endpoint: string
    rootTitle: string
    scope: Entry['scope']
  }) {
    super()

    this.endpoint = new URL(options.endpoint)
    this.projectName = options.projectName
    this.rootTitle = options.rootTitle
    this.scope = options.scope
  }

  get name() {
    return 'Scrapbox'
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

    const entryObject: Entry = {
      body: {
        html: '',
        plain: entry.lines?.map(line => line.text).join('\n'),
      },
      createdAt: entry.created,
      path: this.toPath(entry.title),
      root: entry.title === this.rootTitle,
      scope: this.scope,
      updatedAt: entry.updated,
    }
    entryObject.body.html = entryObject.body.plain
    return entryObject
  }

  async getEntries(): Promise<Entry[]> {
    const entries = Scrapbox.transformOrThrow(
      (await soxa.get(this.getApi('/'))).data,
    )

    return entries.pages.map(
      (entry): Entry => {
        const entryObject: Entry = {
          body: {
            html: '',
            plain: entry.descriptions.join('\n'),
          },
          createdAt: entry.created,
          path: this.toPath(entry.title),
          root: entry.title === this.rootTitle,
          scope: this.scope,
          updatedAt: entry.updated,
        }
        entryObject.body.html = entryObject.body.plain
        return entryObject
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
