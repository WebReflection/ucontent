# <em>µ</em>content

[![Build Status](https://travis-ci.com/WebReflection/ucontent.svg?branch=master)](https://travis-ci.com/WebReflection/ucontent) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/ucontent/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/ucontent?branch=master)

![sunflowers](./ucontent-head.jpg)

<sup>**Social Media Photo by [Bonnie Kittle](https://unsplash.com/@bonniekdesign) on [Unsplash](https://unsplash.com/)**</sup>


A <em>micro</em> **SSR** oriented HTML/SVG content generator, but if you are looking for a <em>micro</em> **FE** content generator, check _[µhtml](https://github.com/WebReflection/uhtml#readme)_ out.

```js
const {render, html} = require('ucontent');
const fs = require('fs');

const stream = fs.createWriteStream('test.html');
stream.once('open', () => {
  render(
    stream,
    html`<h1>It's ${new Date}!</h1>`
  ).end();
});
```


## API

  * a `render(writable, what)` utility, to render in a `response` or `stream` object, via `writable.write(content)`, or through a callback, the content provided by one of the tags. The function returns the result of `callback(content)` invoke, or the the passed first parameter as is (i.e. the `response` or the `stream`). Please note this helper is _not mandatory_ to render content, as any content is an instance of `String`, so that if you prefer to render it manually, you can always use directly `content.toString()` instead, as every tag returns a specialized instance of _String_.
  * a `html` tag, to render _HTML_ content. Each interpolation passed as layout content, can be either a result from `html`, `css`, `js`, `svg`, or `raw` tag, as well as primitives, such as `string`, `boolean`, `number`, or even `null` or `undefined`. The result is a specialized instance of `String` with a `.min()` method to produce eventually minified _HTML_ content via [html-minifier](https://www.npmjs.com/package/html-minifier). All layout content, if not specialized, will be safely escaped, while attributes will always be escaped to avoid layout malfunctions.
  * a `svg` tag, identical to the `html` one, except minification would preserve any self-closing tag, as in `<rect />`.
  * a `css` tag, to create _CSS_ content. Its interpolations will be stringified, and it returns a specialized instance of `String` with a `.min()` method to produce eventually minified _CSS_ content via [csso](https://www.npmjs.com/package/csso). If passed as `html` or `svg` tag interpolation content, `.min()` will be automatically invoked.
  * a `js` tag, to create _JS_ content. Its interpolations will be stringified, and it returns a specialized instance of `String` with a `.min()` method to produce eventually minified _JS_ content via [uglify-es](https://www.npmjs.com/package/uglify-es). If passed as `html` or `svg` tag interpolation content, `.min()` will be automatically invoked.
  * a `raw` tag, to pass along interpolated _HTML_ or _SVG_ values any kind of content, even partial one, or a broken, layout.

All tags can be used as regular functions, as long as the passed value is a string. Except for `html` and `svg`, the value could be a specialized instance, such as `JS`, `CSS`, or `Raw`.

This allow content to be retrieved a part and then be used as is within these tags.

```js
import {readFileSync} from 'fs';
const code = js(readFileSync('./code.js'));
const style = css(readFileSync('./style.css'));
const partial = raw(readFileSync('./partial.html'));

const head = title => html`
  <head>
    <title>${title}</title>
    <style>${style}</style>
    <script>${code}</script>
  </head>
`;

const body = () => html`<body>${partial}</body>`;

const page = title => html`
  <!doctype html>
  <html>
    ${head(title)}
    ${body()}
  </html>
`;
```

All pre-generated content can be passed along, automatically avoiding minification of the same content per each request.

```js
// will be re-used and minified only once
const jsContent = js`/* same JS code to serve */`;
const cssContent = css`/* same CSS content to serve */`;

require('http')
  .createServer((request, response) => {
    render(response, html`
      <!doctype html>
      <html>
        <head>
          <title>µcontent</title>
          <style>${cssContent}</style>
          <script>${jsContent}</script>
        </head>
      </html>
    `.min());
  })
  .listen(8080);
```

If one of the _HTML_ interpolations is `null` or `undefined`, an empty string will be placed instead.


## Attributes Logic

  * as it is for _µhtml_ too, sparse attributes are not supported: this is ok `attr=${value}`, but this is wrong: `attr="${x} and ${y}"`.
  * all attributes are safely escaped by default.
  * if an attribute value is `null` or `undefined`, the attribute won't show up in the layout
  * `aria=${object}` attributes are assigned _hyphenized_ as `aria-a11y` attributes. The `role` is passed instead as `role=...`.
  * `data=${object}` attributes are assigned _hyphenized_ as `data-user-land` attributes
  * `style=${css...}` attributes are minified, if the interpolation value is passed as `css` tag
  * `ref=${...}` attributes are simply ignored
  * `.contentEditable=${...}`, `.disabled=${...}` and any attribute defined as setter, will not be in the layout if the passed value is `null`, `undefined`, or `false`, it will be in the layout if the passed value is `true`, it will contain escaped value in other cases. The attribute is normalized without the dot prefix, and lower-cased.
  * `on...=${'...'}` events passed as string or passed as `js` tag will be preserved, and in the `js` tag case, minified.
  * `on...=${...}` events that pass a callback will be ignored, as it's impossible to bring scope in the layout


## Benchmark

Directly from [pelo](https://github.com/shuhei/pelo#readme) project but without listeners, as these are mostly useless for SSR.

Rendering a simple view 10,000 times:

```js
node test/pelo.js
```

|  tag     | time (ms)  |
| -------- | ---------- |
| ucontent |  117.668ms |
|  pelo    |  129.332ms |


## How To Live Test

Create a `test.js` file in any folder you like, then `npm i ucontent` in that very same folder.

Write the following in the `test.js` file and save it:

```js
const {render, html} = require('ucontent');

require('http').createServer((req, res) => {
  res.writeHead(200, {'content-type': 'text/html;charset=utf-8'});
  render(res, html`
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
        Thank you for trying µcontent at ${new Date()}
      </p>
    `}</body>
    </html>
  `)
  .end();
}).listen(8080);
```

You can now `node test.js` and reach [localhost:8080](http://localhost:8080/), to see the page layout generated.

If you'd like to test the minified version of that output, invoke `.min()` after the closing `</html>` template tag:

```js
  render(res, html`
    <!DOCTYPE html>
    <html lang="en">
      ...
    </html>
  `.min()
  ).end();
```


### API Summary Example

```js
import {render, css, js, html, raw} from 'ucontent';

render(content => response.end(content), html`
<!doctype html>
<html lang=${user.lang}>
  <head>
    <!-- dynamic interpolations -->
    ${meta.map(({name, content}) =>
                  html`<meta name=${name} content=${content}>`)}
    <!-- explicit CSS minification -->
    <style>
    ${css`
      body {
        font-family: sans-serif;
      }
    `}
    </style>
    <!-- explicit JS minification -->
    <script>
    ${js`
      function passedThrough(event) {
        console.log(event);
      }
    `}
    </script>
  </head>
  <!-- discarded callback events -->
  <body onclick=${() => ignored()}>
    <div
      class=${classes.join(' ')}
      always=${'escaped'}
      .contentEditable=${false}
      data=${{name: userName, id: userId}}
      aria=${{role: 'button', labelledby: 'id'}}
      onmouseover=${'passedThrough.call(this,event)'}
    >
      Hello ${userName}!
      ${raw`<some> valid, or even ${'broken'}, </content>`}
    </div>
  </body>
</html>
`.min());
```
