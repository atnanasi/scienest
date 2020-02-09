import { convert } from '../utils/path.ts'
import { RouterMiddleware } from 'https://deno.land/x/oak/mod.ts'
import EntryModel from '../models/entry.ts'
import EntryRepository from '../repositories/entry/scrapbox.ts'
import React from 'https://dev.jspm.io/react/index.js'
import ReactDOMServer from 'https://dev.jspm.io/react-dom/server.js'

export default (entryModel: EntryModel): RouterMiddleware => async ({response}) => {
  const entries = await entryModel.getEntries()

  response.body = ReactDOMServer.renderToString(
    <html lang='ja'>
      <head>
        <meta charSet='utf-8' />
        <title>Scienest</title>
      </head>
      <body>
        <ul>
          {entries.map(entry => (
            <li key={entry.path}>{entry.path} - {entry.body.html}</li>
          ))}
        </ul>
      </body>
    </html>
  )
}
