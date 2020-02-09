import { Application } from 'https://deno.land/x/oak/mod.ts'
import { Router } from 'https://deno.land/x/oak/mod.ts'
import * as config from './config.ts'
import * as entryHandler from './handlers/entries.ts'
import apiIndex from './handlers/index.ts'
import client from './database/postgres/client.ts'
import Entry from './models/entry.ts'
import entryView from './views/entry.tsx'
import indexView from './views/index.tsx'
import log from './utils/logger.ts'
import PostgresEntryRepository from './repositories/entry/postgres.ts'
import requestLogger from './middleware/requestLogger.ts'
import responseTime from './middleware/responseTime.ts'
import ScrapboxEntryRepository from './repositories/entry/scrapbox.ts'

async function main() {
  if (config.APP_ENV === 'development') {
    log.warning('development mode!')
  }

  log.info('Connecting to database')
  await client.connect()

  const entry = new Entry([
    new PostgresEntryRepository({ client }),
    new ScrapboxEntryRepository({
      endpoint: config.SCRAPBOX_API,
      projectName: config.SCRAPBOX_PROJECT,
      rootTitle: config.SCRAPBOX_ROOT,
      scope: config.SCRAPBOX_SCOPE,
    }),
  ])

  const router = new Router({ strict: true })

  router.get('/api', apiIndex)
  router.get('/api/entries', entryHandler.getEntries(entry))
  router.post('/api/entries', entryHandler.createEntry(entry))
  router.get('/api/entries/', entryHandler.getEntry(entry))
  router.get('/api/entries/:path', entryHandler.getEntry(entry))
  router.put('/api/entries/:path', entryHandler.updateEntry(entry))
  router.delete('/api/entries/:path', entryHandler.deleteEntry(entry))
  router.get('/', indexView(entry))
  router.get('/entries/', entryView(entry))
  router.get('/entries/:path', entryView(entry))

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
