'use strict';
const csso = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('csso'));
const html = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('html-minifier'));
const uglify = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uglify-es'));

const {setPrototypeOf} = Object;

// the CSS chunk + min()
class CSS extends Buffer {
  constructor(content) {
    return setPrototypeOf(Buffer.from(content), CSS.prototype);
  }
  min() {
    return csso.minify(this.toString()).css;
  }
}
exports.CSS = CSS;


// the HTML chunk + min()
const htmlOptions = {
  collapseWhitespace: true,
  html5: true,
  keepClosingSlash: true,
  preventAttributesEscaping: true,
  removeAttributeQuotes: true,
  removeComments: true
};

class HTML extends Buffer {
  constructor(content) {
    return setPrototypeOf(Buffer.from(content), HTML.prototype);
  }
  min() {
    return html.minify(this.toString(), htmlOptions);
  }
}
exports.HTML = HTML;


// the JS chunk + min()
const jsOptions = {
  output: {
    comments: /^!/
  }
};

class JS extends Buffer {
  constructor(content) {
    return setPrototypeOf(Buffer.from(content), JS.prototype);
  }
  min() {
    return uglify.minify(this.toString(), jsOptions).code;
  }
}
exports.JS = JS;


// the Raw chunk + min() as toString()
class Raw extends Buffer {
  constructor(content) {
    return setPrototypeOf(Buffer.from(content), Raw.prototype);
  }
  min() {
    return this.toString();
  }
}
exports.Raw = Raw;
