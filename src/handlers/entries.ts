import { convert } from '../utils/path.ts'
import { RouterMiddleware } from 'https://deno.land/x/oak/mod.ts'
import Entry from '../models/entry.ts'

export const getEntries = (entry: Entry): RouterMiddleware => async ({
  response,
}) => {
  response.body = await entry.getEntries()
}

export const getEntry = (entry: Entry): RouterMiddleware => async ({
  params,
  response,
}) => {
  response.body = await entry.getEntry(convert(params.path))
}

export const createEntry = (entry: Entry): RouterMiddleware => async ({
  request,
  response,
}) => {
  const body = await request.body()
  response.body = await entry.createEntry(body.value)
}

export const updateEntry = (entry: Entry): RouterMiddleware => async ({
  params,
  request,
  response,
}) => {
  const body = await request.body()
  await entry.updateEntry(convert(params.path), body.value)

  response.body = await entry.getEntry(body.value.path)
  response.headers.set(
    'Location',
    `http://localhost:4000/api/entries${body.value.path}`,
  )
  response.status = 201
}

export const deleteEntry = (entry: Entry): RouterMiddleware => async ({
  params,
  response,
}) => {
  response.body = await entry.deleteEntry(convert(params.path))
  response.status = 204
}
