import csso from 'csso';
import html from 'html-minifier';
import uglify from 'uglify-es';

// the CSS chunk + min()
export class CSS extends String {
  min() {
    return csso.minify(this.toString()).css;
  }
};


// the HTML chunk + min()
const htmlOptions = {
  collapseWhitespace: true,
  html5: true,
  keepClosingSlash: true,
  preventAttributesEscaping: true,
  removeAttributeQuotes: true,
  removeComments: true
};

export class HTML extends String {
  min() {
    return html.minify(this.toString(), htmlOptions);
  }
};


// the JS chunk + min()
const jsOptions = {
  output: {
    comments: /^!/
  }
};

export class JS extends String {
  min() {
    return uglify.minify(this.toString(), jsOptions).code;
  }
};


// the Raw chunk + min() as toString()
export class Raw extends String {
  min() {
    return this.toString();
  }
};
