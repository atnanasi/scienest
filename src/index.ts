import { APP_HOST, APP_PORT, APP_ENV } from './config.ts'
import { Application } from 'https://deno.land/x/oak/mod.ts'
import { Router } from 'https://deno.land/x/oak/mod.ts'
import * as entry from './handlers/entries.ts'
import client from './database/postgres/client.ts'
import entryView from './views/entry.tsx'
import index from './handlers/index.ts'
import indexView from './views/index.tsx'
import log from './utils/logger.ts'
import requestLogger from './middleware/requestLogger.ts'
import responseTime from './middleware/responseTime.ts'

async function main() {
  if (APP_ENV === 'development') {
    log.warning('development mode!')
  }

  log.info('Connecting to database')
  await client.connect()

  const router = new Router({ strict: true })

  router.get('/api', index)
  router.get('/api/entries', entry.getEntries)
  router.post('/api/entries', entry.createEntry)
  router.get('/api/entries/', entry.getEntry)
  router.get('/api/entries/:path', entry.getEntry)
  router.put('/api/entries/:path', entry.updateEntry)
  router.delete('/api/entries/:path', entry.deleteEntry)
  router.get('/', indexView)
  router.get('/entries/', entryView)
  router.get('/entries/:path', entryView)
  
  const app = new Application()

  app.use(requestLogger)
  app.use(responseTime)
  app.use(router.routes())
  app.use(router.allowedMethods())

  log.info(`Listenig on ${APP_HOST}:${APP_PORT}`)
  await app.listen(`${APP_HOST}:${APP_PORT}`)

  log.info(`Closing database connection`)
  await client.end()
}

main()
