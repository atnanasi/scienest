import { Router } from 'https://deno.land/x/oak/mod.ts'
import getEntries from '../handlers/getEntries.ts'
import getEntry from '../handlers/getEntry.ts'

const router = new Router({ prefix: '/api', strict: true })

router.get('/entries', getEntries)
router.get('/entries/', getEntry)
router.get('/entries/:path', getEntry)

export default router