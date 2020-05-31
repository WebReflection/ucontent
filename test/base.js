const {render, html} = require('../cjs');

html.minified = true;

require('http').createServer((req, res) => {
  res.writeHead(200, {'content-type': 'text/html;charset=utf-8'});
  render(content => res.end(content), html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ucontent</title>
    </head>
    <body>${html`
      <h1>Hello There</h1>
      <p>
        Thank you for visiting uhtml at ${new Date()}
      </p>
    `}</body>
    </html>
  `);
}).listen(8080);

console.log('http://localhost:8080/');
