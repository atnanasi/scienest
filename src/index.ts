import { Application } from 'https://deno.land/x/oak/mod.ts'
import { Router } from 'https://deno.land/x/oak/mod.ts'
import * as config from './config.ts'
import * as entryHandler from './handlers/articles.ts'
import apiIndex from './handlers/index.ts'
import Article from './models/article.ts'
import ArticleRepository from './repositories/article/index.ts'
import articleView from './views/article.tsx'
import client from './database/postgres/client.ts'
import indexView from './views/index.tsx'
import log from './utils/logger.ts'
import PostgresArticleRepository from './repositories/article/postgres.ts'
import requestLogger from './middleware/requestLogger.ts'
import responseTime from './middleware/responseTime.ts'
import ScrapboxArticleRepository from './repositories/article/scrapbox.ts'

async function main() {
  if (config.APP_ENV === 'development') {
    log.warning('development mode!')
  }

  log.info('Connecting to database')
  await client.connect()

  const repositories: ArticleRepository[] = [
    new PostgresArticleRepository({ client }),
  ]
  if (config.SCRAPBOX_ENABLE)
    repositories.push(
      new ScrapboxArticleRepository({
        endpoint: config.SCRAPBOX_API,
        projectName: config.SCRAPBOX_PROJECT,
        rootTitle: config.SCRAPBOX_ROOT,
        scope: config.SCRAPBOX_SCOPE,
      }),
    )

  const article = new Article(repositories)

  const router = new Router({ strict: true })

  router.get('/api', apiIndex)
  router.get('/api/articles', entryHandler.list(article))
  router.post('/api/articles', entryHandler.create(article))
  router.get('/api/articles/', entryHandler.get(article))
  router.get('/api/articles/:path', entryHandler.get(article))
  router.put('/api/articles/:path', entryHandler.update(article))
  router.delete('/api/articles/:path', entryHandler.deleteArticle(article))
  router.get('/', indexView(article))
  router.get('/articles/', articleView(article))
  router.get('/articles/:path', articleView(article))

  const app = new Application()

  app.use(requestLogger)
  app.use(responseTime)
  app.use(router.routes())
  app.use(router.allowedMethods())

  log.info(`Listenig on ${config.APP_HOST}:${config.APP_PORT}`)
  await app.listen(`${config.APP_HOST}:${config.APP_PORT}`)

  log.info(`Closing database connection`)
  await client.end()
}

main()
