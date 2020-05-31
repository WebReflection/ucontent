const {createServer} = require('http');

const {render, html} = require('../cjs');

const counter = require('./counter-fe.js');

const header = {'content-type': 'text/html;charset=utf-8'};

const page = html`
  <!doctype html>
  <html>
    <head>
      <title>SSR Component</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <style>${counter.style}</style>
      <script>${counter.script}</script>
    </head>
    <body>
      ${counter.view}
    </body>
  </html>
`.min();

createServer(
  (_, response) => {
    response.writeHead(200, header);
    render(response, page).end();
  }
)
.listen(
  8080,
  () => console.log('http://localhost:8080/')
);
