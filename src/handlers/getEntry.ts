import { getEntry } from '../services/entry.ts'

export default async ({ params, response }) => {
  response.body = await getEntry(
    params.path ? `/${params.path}` : '/'
  )
}
