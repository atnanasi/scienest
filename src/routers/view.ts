import { Router } from 'https://deno.land/x/oak/mod.ts'
import entry from '../views/entry.tsx'
import index from '../views/index.tsx'

const router = new Router({ strict: true })

router.get('/', index)
router.get('/entries/', entry)
router.get('/entries/:path', entry)

export default router
