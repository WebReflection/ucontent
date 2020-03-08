import csso from 'csso';
import html from 'html-minifier';
import uglify from 'uglify-es';

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
export const CSS = createTag(minCSS);
export function minCSS() {
  return csso.minify(this.toString()).css;
};

// The HTML Tag
const htmlOptions = {
  collapseWhitespace: true,
  html5: true,
  keepClosingSlash: true,
  preventAttributesEscaping: true,
  removeAttributeQuotes: true,
  removeComments: true
};
export const HTML = createTag(minHTML);
export function minHTML() {
  return html.minify(this.toString(), htmlOptions);
};

// The JS Tag
const jsOptions = {
  output: {
    comments: /^!/
  }
};
export const JS = createTag(minJS);
export function minJS() {
  return uglify.minify(this.toString(), jsOptions).code;
};

// The Raw Tag
export const Raw = createTag(minRaw);
export function minRaw() {
  return this.toString();
};
