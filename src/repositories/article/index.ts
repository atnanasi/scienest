export interface Article {
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

export interface NewArticle {
  body: Article['body']['plain']
  path: Article['path']
  scope: Article['scope']
}

export interface GetArticleOptions {
  scope?: Article['scope']
}

export default abstract class ArticleRepository {
  abstract get name(): string
  abstract async create(entry: NewArticle): Promise<Article['path']>
  abstract async delete(path: Article['path']): Promise<void>
  abstract async list(options?: GetArticleOptions): Promise<Article[]>
  abstract async get(
    path: Article['path'],
    options?: GetArticleOptions,
  ): Promise<Article>
  abstract async update(
    path: Article['path'],
    entry: Article,
  ): Promise<Article['path']>
}
