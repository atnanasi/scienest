import { join } from 'path'
import Koa from 'koa'
import Router from 'koa-router'
import serve from 'koa-static'

const clientPath = join(__dirname, './../client/dist')

const app = new Koa()
const router = new Router()

router.get('/api', async ctx => {
    ctx.type = "json"
    ctx.body = {'message': 'hello', state: 200}
})

app
    .use(router.routes())
    .use(serve(clientPath))

const port = process.env.PORT || 3000
app.listen(port)
console.log(`Application has booted on http://localhost:${port}`)
