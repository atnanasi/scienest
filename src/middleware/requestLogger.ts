import { green, bold } from 'https://deno.land/std/fmt/colors.ts'
import log from '../utils/logger.ts'
import { Middleware } from 'https://deno.land/x/oak/mod.ts'

const requestLogger: Middleware = async (ctx, next) => {
  await next()
  const rt = ctx.response.headers.get('X-Response-Time')
  log.info(
    `${green(ctx.request.method)} ${ctx.request.url} - ${bold(String(rt))}`,
  )
}

export default requestLogger
