import { Router } from 'https://deno.land/x/oak/mod.ts'
import * as entry from '../handlers/entries.ts'
import index from '../handlers/index.ts'

const router = new Router({ strict: true })

router.get('/api', index)
router.get('/api/entries', entry.getEntries)
router.post('/api/entries', entry.createEntry)
router.get('/api/entries/', entry.getEntry)
router.get('/api/entries/:path', entry.getEntry)
router.put('/api/entries/:path', entry.updateEntry)
router.delete('/api/entries/:path', entry.deleteEntry)

export default router
