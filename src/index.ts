import { APP_HOST, APP_PORT } from './config.ts'
import { Application } from 'https://deno.land/x/oak/mod.ts'
import client from './database.ts'
import log from './utils/logger.ts'
import logger from './middleware/logging.ts'
import router from './router.ts'
import rt from './middleware/rt.ts'

const app = new Application()

app.use(logger);
app.use(rt);
app.use(router.routes())
app.use(router.allowedMethods())

log.info('Connecting to database')
await client.connect()

log.info(`Listenig on ${APP_HOST}:${APP_PORT}`)
await app.listen(`${APP_HOST}:${APP_PORT}`)

log.info(`Closing database connection`)
await client.end()
