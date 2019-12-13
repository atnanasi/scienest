import { Router } from 'https://deno.land/x/oak/mod.ts'
import entry from './handlers/entry.tsx'
import getEntries from './handlers/getEntries.ts'
import index from './handlers/index.tsx'

const router = new Router()

router.get('/', index)
router.get('/entries', entry)
router.get('/entries/:path', entry)
router.get('/api/entries', getEntries)

export default router