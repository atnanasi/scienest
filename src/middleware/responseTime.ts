import { Middleware } from 'https://deno.land/x/oak/mod.ts'

const responseTime: Middleware = async (ctx, next) => {
  const start = Date.now();
  await next();
  const rt = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${rt}ms`);
}

export default responseTime