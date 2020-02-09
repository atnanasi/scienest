import { convert } from '../utils/path.ts'
import { RouterMiddleware } from 'https://deno.land/x/oak/mod.ts'
import EntryModel from '../models/entry.ts'
import React from 'https://dev.jspm.io/react/index.js'
import ReactDOMServer from 'https://dev.jspm.io/react-dom/server.js'

export default (entryModel: EntryModel): RouterMiddleware => async ({params, response}) => {
  const entry = await entryModel.getEntry(convert(params.path))

  response.body = ReactDOMServer.renderToString(
    <html lang='ja'>
      <head>
        <meta charSet='utf-8' />
        <title>Scienest</title>
      </head>
      <body>
        <h1>{entry.path}</h1>
        <p>{entry.body.html}</p>
      </body>
    </html>
  )
}
