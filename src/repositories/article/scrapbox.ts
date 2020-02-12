import { soxa } from 'https://deno.land/x/soxa@v0.3/mod.ts'
import $ from 'https://cdn.jsdelivr.net/gh/rokoucha/transform-ts@master/mod.ts'
import { $unixtime } from '../../utils/transformers.ts'
import ArticleRepository, { Article, NewArticle } from './index.ts'

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

const Project = $.obj({
  created:             $unixtime,
  displayName:         $.string,
  id:                  $.string,
  image:               $.string,
  name:                $.string,
  publicVisible:       $.boolean,
  updated:             $unixtime,
})

export default class ScrapboxArticleRepository extends ArticleRepository {
  private endpoint: URL
  private projectName: string
  private rootTitle: string
  private scope: Article['scope']
  private cachedPages: Array<any>
  private updatedAt: Date

  constructor(options: {
    projectName: string
    endpoint: string
    rootTitle: string
    scope: Article['scope']
  }) {
    super()

    this.endpoint = new URL(options.endpoint)
    this.projectName = options.projectName
    this.rootTitle = options.rootTitle
    this.scope = options.scope
    this.updatedAt = new Date(0)
  }

  get name() {
    return 'Scrapbox'
  }

  private getApi(mode: 'pages'|'projects', pageName = ''): string {
    return `${this.endpoint.href}api/${mode}/${this.projectName}/${pageName}`
  }

  private toPath(title: string): string {
    return title === this.rootTitle ? '/' : `/${decodeURIComponent(title)}`
  }

  private toTitle(path: string): string {
    return path === '/' ? this.rootTitle : encodeURIComponent(path.substring(1))
  }

  private async getProject() {
    return Project.transformOrThrow(
      (await soxa.get(this.getApi('projects'))).data
    )
  }

  private async fetchPagesWithCache(pageName?: string) {
    const project = await this.getProject()
    
    const isOldCache = this.updatedAt < project.updated

    if(isOldCache) {
      const pages = Scrapbox.transformOrThrow(
        (await soxa.get(this.getApi('pages'))).data,
      )

      this.cachedPages = pages.pages

      this.updatedAt = project.updated
    }

    if(pageName) {
      const index = this.cachedPages.findIndex(cachedPage => cachedPage.title === pageName)

      if(this.cachedPages[index].lines === undefined || isOldCache) {
        this.cachedPages[index] = Page.transformOrThrow(
          (await soxa.get(this.getApi('pages', pageName))).data,
        )
      }
    }

    return this.cachedPages
  }

  async get(path: string): Promise<Article> {
    const articles = await this.fetchPagesWithCache(this.toTitle(path))

    const article = articles.find(article => article.title === this.toTitle(path))

    const articleObject: Article = {
      body: {
        html: '',
        plain: article.lines?.map(line => line.text).join('\n'),
      },
      createdAt: article.created,
      path: this.toPath(article.title),
      root: article.title === this.rootTitle,
      scope: this.scope,
      updatedAt: article.updated,
    }
    articleObject.body.html = articleObject.body.plain
    return articleObject
  }

  async list(): Promise<Article[]> {
    return (await this.fetchPagesWithCache()).map(
      (article): Article => {
        const articleObject: Article = {
          body: {
            html: '',
            plain: article.descriptions.join('\n'),
          },
          createdAt: article.created,
          path: this.toPath(article.title),
          root: article.title === this.rootTitle,
          scope: this.scope,
          updatedAt: article.updated,
        }
        articleObject.body.html = articleObject.body.plain
        return articleObject
      },
    )
  }

  async create(entry: NewArticle): Promise<Article['path']> {
    return ''
  }

  async update(
    path: Article['path'],
    entry: Article,
  ): Promise<Article['path']> {
    return ''
  }

  async delete(path: Article['path']): Promise<void> {}
}
