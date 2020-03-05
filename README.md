# <em>µ</em>content

[![Build Status](https://travis-ci.com/WebReflection/ucontent.svg?branch=master)](https://travis-ci.com/WebReflection/ucontent) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/ucontent/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/ucontent?branch=master)

![sunflowers](./ucontent-head.jpg)

<sup>**Social Media Photo by [Bonnie Kittle](https://unsplash.com/@bonniekdesign) on [Unsplash](https://unsplash.com/)**</sup>


An SSR oriented HTML content generator.


## API

  * `css` tag to explicitly minify CSS within an interpolation ([csso based](https://www.npmjs.com/package/csso))
  * `js` tag to explicitly minify JS within an interpolation ([uglify-es based](https://www.npmjs.com/package/uglify-es))
  * `raw` tag to pass through an interpolation any kind of content, even partial layout
  * `html` tag to define any simple to complex layout, with a `.min()` method to produce minified HTML content ([html-minifier based](https://www.npmjs.com/package/html-minifier))

All tag returns a specialized `instanceof String`, if used in the wild, remember to eventually use `.toString()` or `.min()`, if you want the value to be minified.

By default, all interpolated content is escaped, unless it was passed via `raw`.


### Attributes Logic

  * all attributes are escaped by default
  * if an attribute value is `null` or `undefined`, the attribute won't show up in the layout
  * `data=${object}` attributes are assigned _hyphenized_ as `data-user-land` attributes
  * `aria=${object}` attributes are assigned _hyphenized_ as `aria-a11y` attributes. The `role` is passed instead as `role=...`.
  * `.contentEditable=${...}`, `.disabled=${...}` and any attribute defined as setter, will not be in the layout if the passed value is `null`, `undefined`, or `false`, it will be in the layout if the passed value is `true`, it will contain escaped value in other cases. The attribute is normalized without the dot prefix, and lower-cased.
  * `on...=${...}` events that pass a callback will be ignored, as it's impossible to bring scope in the layout
  * `on...=${'...'}` events passed as strings will be preserved.
  
You could use the `js` tag to minified on the fly JS in attributes, but remember to pass it via `.min()`.
The same goes for `css` in case you'd like to inline minified `style=${...}` attributes.

Bear in mind both `js` and `css` minification can be expensive, and this module doesn't know anything about JS or CSS until you explicitly opt in.


#### API Summary Example

```js
import {css, js, html, raw} from 'ucontent';

response.write(html`
<!doctype html>
<html lang=${user.lang}>
  <head>
    <!-- dynamic interpolations -->
    ${meta.map(({name, content}) =>
                  html`<meta name=${name} content=${content}>`)}
    <!-- explicit CSS minification -->
    <style>${css`
      body {
        font-family: sans-serif;
      }
    `}</style>
    <!-- explicit JS minification -->
    <script>${js`
      function passedThrough(event) {
        console.log(event);
      }
    `}</script>
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
      ${raw`<some> any valid or broken </content>`}
    </div>
  </body>
</html>
`.min() // optional HTML minifier included
);
```