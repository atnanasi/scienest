import { Router } from 'https://deno.land/x/oak/mod.ts'
import entry from './handlers/entry.tsx'
import getEntries from './handlers/getEntries.ts'
import getEntry from './handlers/getEntry.ts'
import index from './handlers/index.tsx'

const router = new Router({ strict: true })

router.get('/', index)
router.get('/entries/', entry)
router.get('/entries/:path', entry)
router.get('/api/entries', getEntries)
router.get('/api/entries/', getEntry)
router.get('/api/entries/:path', getEntry)

export default router