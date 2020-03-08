'use strict';
const csso = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('csso'));
const html = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('html-minifier'));
const uglify = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uglify-es'));

function chunks(value, i) {
  return value + this[i + 1];
}

const createTag = min => (template, ...values) => {
  const buf = Buffer.from(
    typeof template === 'string' ?
      template :
      join(template, values),
    'utf-8'
  );
  buf.min = min;
  return buf;
};

const join = (tpl, val) => tpl[0] + val.map(chunks, tpl).join('');

// The CSS Tag
const CSS = createTag(minCSS);
exports.CSS = CSS;
function minCSS() {
  return csso.minify(this.toString()).css;
}
exports.minCSS = minCSS;

// The HTML Tag
const htmlOptions = {
  collapseWhitespace: true,
  html5: true,
  keepClosingSlash: true,
  preventAttributesEscaping: true,
  removeAttributeQuotes: true,
  removeComments: true
};
const HTML = createTag(minHTML);
exports.HTML = HTML;
function minHTML() {
  return html.minify(this.toString(), htmlOptions);
}
exports.minHTML = minHTML;

// The JS Tag
const jsOptions = {
  output: {
    comments: /^!/
  }
};
const JS = createTag(minJS);
exports.JS = JS;
function minJS() {
  return uglify.minify(this.toString(), jsOptions).code;
}
exports.minJS = minJS;

// The Raw Tag
const Raw = createTag(minRaw);
exports.Raw = Raw;
function minRaw() {
  return this.toString();
}
exports.minRaw = minRaw;
