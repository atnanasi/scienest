import React from 'https://dev.jspm.io/react/index.js';
import ReactDOMServer from 'https://dev.jspm.io/react-dom/server.js';
import EntryRepository from '../repositories/scrapbox/entry.ts'

const Entry = new EntryRepository('rokoucha')

export default async ({params, response}) => {
  console.log(params.path)
  
  const entry = await Entry.getEntry(
    params.path ? `/${params.path}` : '/'
  )

  response.body = ReactDOMServer.renderToString(
    <html lang='ja'>
      <head>
        <meta charSet='utf-8' />
        <title>Scienest</title>
      </head>
      <body>
        <h1>{entry.path}</h1>
        <p>{entry.body}</p>
      </body>
    </html>
  )
}