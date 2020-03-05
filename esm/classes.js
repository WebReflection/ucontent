import csso from 'csso';
import html from 'html-minifier';
import uglify from 'uglify-es';

const minifyCSS = css => csso.minify(css).css;
export class CSS extends String { min() { return minifyCSS(this.toString()); } };

const htmlOptions = {
  collapseWhitespace: true,
  html5: true,
  keepClosingSlash: true,
  preventAttributesEscaping: true,
  removeAttributeQuotes: true,
  removeComments: true
};
const minifyHTML = content => html.minify(content, htmlOptions);
export class HTML extends String { min() { return minifyHTML(this.toString()); } };

const jsOptions = {
  output: {
    comments: /^!/
  }
};
const minifyJS = js => uglify.minify(js, jsOptions).code;
export class JS extends String { min() { return minifyJS(this.toString()); } };

// expose `.min()` but do nothing with it
export class Raw extends String { min() { return this.toString(); } };
