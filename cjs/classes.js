'use strict';
const csso = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('csso'));
const html = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('html-minifier'));
const uglify = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uglify-es'));

// the CSS chunk + min()
class CSS extends String {
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

class HTML extends String {
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

class JS extends String {
  min() {
    return uglify.minify(this.toString(), jsOptions).code;
  }
}
exports.JS = JS;


// the Raw chunk + min() as toString()
class Raw extends String {
  min() {
    return this.toString();
  }
}
exports.Raw = Raw;
