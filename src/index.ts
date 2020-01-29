import { APP_HOST, APP_PORT } from './config.ts'
import { Application } from 'https://deno.land/x/oak/mod.ts'
import api from './routers/api.ts'
import client from './database.ts'
import log from './utils/logger.ts'
import requestLogger from './middleware/requestLogger.ts'
import responseTime from './middleware/responseTime.ts'
import view from './routers/view.ts'

async function main() {
  const app = new Application()

  app.use(requestLogger)
  app.use(responseTime)
  app.use(api.routes())
  app.use(api.allowedMethods())
  app.use(view.routes())
  app.use(view.allowedMethods())

  log.info('Connecting to database')
  await client.connect()

  log.info(`Listenig on ${APP_HOST}:${APP_PORT}`)
  await app.listen(`${APP_HOST}:${APP_PORT}`)

  log.info(`Closing database connection`)
  await client.end()
}

main()
