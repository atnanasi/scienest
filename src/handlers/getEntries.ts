import { getEntries } from '../services/entry.ts'

export default async ({response}) => {
  response.body = await getEntries()
}