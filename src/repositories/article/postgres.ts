import { Client } from 'https://deno.land/x/postgres/mod.ts'
import { QueryResult } from 'https://deno.land/x/postgres/query.ts'
import AtricleRepository, {
  Article,
  NewArticle,
  GetArticleOptions,
} from './index.ts'

export default class PostgresArticleRepository extends AtricleRepository {
  private client: Client

  constructor(options: { client: Client }) {
    super()
    this.client = options.client
  }

  get name() {
    return 'Postgres'
  }

  async get(
    path: Article['path'],
    options?: GetArticleOptions,
  ): Promise<Article> {
    let articles: QueryResult

    if (options?.scope) {
      articles = await this.client.query(
        'SELECT * FROM articles WHERE path = $1 AND scope_private = $2 AND scope_unlisted = $3;',
        path,
        options.scope === 'private',
        options.scope === 'unlisted',
      )
    } else {
      articles = await this.client.query(
        'SELECT * FROM articles WHERE path = $1;',
        path,
      )
    }

    if (articles.rows.length < 1) throw new Error('Article not found')

    return articles.rows
      .map(
        (article): Article => {
          const articleObject: Article = {
            path: article.shift(),
            body: {
              plain: article.shift(),
              html: '',
            },
            updatedAt: article.shift(),
            createdAt: article.shift(),
            root: article.shift(),
            scope:
              article.shift() === true
                ? 'private'
                : article.shift() === true
                ? 'unlisted'
                : 'private',
          }
          articleObject.body.html = articleObject.body.plain
          return articleObject
        },
      )
      .shift()
  }

  async list(options?: GetArticleOptions): Promise<Article[]> {
    let articles: QueryResult

    if (options?.scope) {
      articles = await this.client.query(
        'SELECT * FROM articles WHERE scope_private = $2 AND scope_unlisted = $3;',
        options.scope === 'private',
        options.scope === 'unlisted',
      )
    } else {
      articles = await this.client.query('SELECT * FROM articles;')
    }

    return articles.rows.map(
      (article): Article => {
        const articleObject: Article = {
          path: article.shift(),
          body: {
            plain: article.shift(),
            html: '',
          },
          updatedAt: article.shift(),
          createdAt: article.shift(),
          root: article.shift(),
          scope: article.shift()
            ? 'private'
            : article.shift()
            ? 'unlisted'
            : 'public',
        }

        articleObject.body.html = articleObject.body.plain
        return articleObject
      },
    )
  }

  async create(article: NewArticle): Promise<Article['path']> {
    await this.client.query(
      'INSERT INTO "articles" ("path", "body", "scope_private", "scope_unlisted") VALUES ($1, $2, $3, $4);',
      article.path,
      article.body,
      article.scope === 'private',
      article.scope === 'unlisted',
    )

    return article.path
  }

  async update(
    path: Article['path'],
    article: Article,
  ): Promise<Article['path']> {
    await this.client.query(
      'UPDATE "articles" SET "path" = $1, "body" = $2, "scope_private" = $3, "scope_unlisted" = $4, "updated_at" = now() WHERE "path" = $5;',
      article.path,
      article.body,
      article.scope === 'private',
      article.scope === 'unlisted',
      path,
    )

    return article.path
  }

  async delete(path: Article['path']): Promise<void> {
    await this.client.query(
      'DELETE FROM "articles" WHERE (("path" = $1));',
      path,
    )
  }
}
