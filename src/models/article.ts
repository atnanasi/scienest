import ArticleRepository, {
  Article,
  NewArticle,
} from '../repositories/article/index.ts'
import PostgresArticleRepository from '../repositories/article/postgres.ts'
import log from '../utils/logger.ts'

const DEFAULT_REPOSITORY = PostgresArticleRepository.prototype.name

export type GetEntryOptions = { repositoryName?: string }

export interface MultiBackendArticle extends Article {
  backend: string
  realPath: Article['path']
}

export default class ArticleModel {
  private repositories: ArticleRepository[]

  constructor(repositories: ArticleRepository[]) {
    repositories.forEach(repository => {
      log.info(`Repository "${repository.name}" booted`)
    })
    this.repositories = repositories
  }

  private getRepository(name: string): ArticleRepository {
    return this.repositories
      .filter(repository => repository.name === name)
      .pop()
  }

  private renameDuplicatePath(options: {
    articles: MultiBackendArticle[]
    path: Article['path']
    backend: MultiBackendArticle['backend']
  }): Article['path'] {
    return options.articles.find(entry => entry.path === options.path)
      ? this.renameDuplicatePath({
          articles: options.articles,
          path: `/${options.backend}_${options.path}`,
          backend: options.backend,
        })
      : options.path
  }

  public async create(entry: NewArticle): Promise<MultiBackendArticle['path']> {
    const repository = this.getRepository(DEFAULT_REPOSITORY)

    return await repository.create(entry)
  }

  public async delete(path: MultiBackendArticle['path']): Promise<void> {
    const repository = this.getRepository(DEFAULT_REPOSITORY)

    await repository.delete(path)
  }

  public async list(args?: GetEntryOptions): Promise<MultiBackendArticle[]> {
    const repositories = args?.repositoryName
      ? [this.getRepository(args.repositoryName)]
      : this.repositories

    const articles: MultiBackendArticle[] = []

    await Promise.all(
      repositories.map(async repository => {
        const articlesInRepository = (await repository.list()) as MultiBackendArticle[]

        for (const article of articlesInRepository) {
          article.backend = repository.name
          article.realPath = article.path

          article.path = this.renameDuplicatePath({
            articles,
            path: article.path,
            backend: article.backend,
          })

          articles.push(article)
        }
      }),
    )

    return articles
  }

  public async get(
    path: MultiBackendArticle['path'],
    args?: GetEntryOptions,
  ): Promise<MultiBackendArticle> {
    const articles = await this.list(args)
    const foundArticle = articles.filter(article => article.path === path)[0]

    const repository = this.getRepository(foundArticle.backend)
    const realPath = foundArticle.path

    const article = (await repository.get(realPath)) as MultiBackendArticle

    article.backend = repository.name
    article.realPath = article.path
    article.path = this.renameDuplicatePath({
      articles,
      path: article.path,
      backend: article.backend,
    })

    return article
  }

  public async update(
    path: MultiBackendArticle['path'],
    article: MultiBackendArticle,
  ): Promise<MultiBackendArticle['path']> {
    const repository = this.getRepository(DEFAULT_REPOSITORY)
    article.path = article.realPath

    return await repository.update(path, article)
  }
}
