'use strict';
const csso = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('csso'));
const html = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('html-minifier'));
const uglify = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uglify-es'));

const minifyCSS = css => csso.minify(css).css;
class CSS extends String { min() { return minifyCSS(this.toString()); } }
exports.CSS = CSS;

const htmlOptions = {
  collapseWhitespace: true,
  html5: true,
  keepClosingSlash: true,
  preventAttributesEscaping: true,
  removeAttributeQuotes: true,
  removeComments: true
};
const minifyHTML = content => html.minify(content, htmlOptions);
class HTML extends String { min() { return minifyHTML(this.toString()); } }
exports.HTML = HTML;

const jsOptions = {
  output: {
    comments: /^!/
  }
};
const minifyJS = js => uglify.minify(js, jsOptions).code;
class JS extends String { min() { return minifyJS(this.toString()); } }
exports.JS = JS;

class Raw extends String {}
exports.Raw = Raw;
