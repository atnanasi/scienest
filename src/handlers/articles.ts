import { convert } from '../utils/path.ts'
import { RouterMiddleware } from 'https://deno.land/x/oak/mod.ts'
import Article from '../models/article.ts'

export const list = (article: Article): RouterMiddleware => async ({
  response,
}) => {
  response.body = await article.list()
}

export const get = (article: Article): RouterMiddleware => async ({
  params,
  response,
}) => {
  response.body = await article.get(convert(params.path))
}

export const create = (article: Article): RouterMiddleware => async ({
  request,
  response,
}) => {
  const body = await request.body()
  response.body = await article.create(body.value)
}

export const update = (article: Article): RouterMiddleware => async ({
  params,
  request,
  response,
}) => {
  const body = await request.body()
  await article.update(convert(params.path), body.value)

  response.body = await article.get(body.value.path)
  response.headers.set(
    'Location',
    `http://localhost:4000/api/entries${body.value.path}`,
  )
  response.status = 201
}

export const deleteArticle = (article: Article): RouterMiddleware => async ({
  params,
  response,
}) => {
  response.body = await article.delete(convert(params.path))
  response.status = 204
}
