import { convert } from '../utils/path.ts'
import { RouterMiddleware } from 'https://deno.land/x/oak/mod.ts'
import Article from '../models/article.ts'
import React from 'https://dev.jspm.io/react/index.js'
import ReactDOMServer from 'https://dev.jspm.io/react-dom/server.js'

export default (articleModel: Article): RouterMiddleware => async ({response}) => {
  const articles = await articleModel.list()

  response.body = ReactDOMServer.renderToString(
    <html lang='ja'>
      <head>
        <meta charSet='utf-8' />
        <title>Scienest</title>
      </head>
      <body>
        <ul>
          {articles.map(article => (
            <li key={article.path}>{article.path} - {article.body.html}</li>
          ))}
        </ul>
      </body>
    </html>
  )
}
