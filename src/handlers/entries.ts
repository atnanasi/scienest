import { convert } from '../utils/path.ts'
import * as Entry from '../services/entry.ts'

export const getEntries = async ({response}) => {
  response.body = await Entry.getEntries()
}

export const getEntry = async ({ params, response }) => {
  response.body = await Entry.getEntry(convert(params.path))
}

export const createEntry = async ({ request, response }) => {
  const body = await request.body()
  response.body = await Entry.createEntry(body.value)
}

export const updateEntry = async ({ params, request, response }) => {
  const body = await request.body()
  await Entry.updateEntry(convert(params.path), body.value)

  response.body = await Entry.getEntry(body.value.path)
  response.headers.set('Location', `http://localhost:4000/api/entries${body.value.path}`)
  response.status = 201
}

export const deleteEntry = async ({ params, response }) => {
  response.body = await Entry.deleteEntry(convert(params.path))
  response.status = 204
}