'use strict';
const csso = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('csso'));
const html = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('html-minifier'));
const uglify = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uglify-es'));

const htmlOptions = {
  collapseWhitespace: true,
  html5: true,
  keepClosingSlash: true,
  preventAttributesEscaping: true,
  removeAttributeQuotes: true,
  removeComments: true
};

const jsOptions = {
  output: {
    comments: /^!/
  }
};

/**
 * The base class for CSS, HTML, JS, and Raw.
 * @private
 */
class UContent extends String {
  /**
   * 
   * @param {string} content The string representing some content.
   * @param {boolean} minified The optional flag to avoid duplicated `.min()`.
   */
  constructor(content, minified = false) {
    super(content).minified = minified;
  }
}
exports.UContent = UContent;


/**
 * The class that represents CSS content.
 */
class CSS extends UContent {
  /**
   * @returns {string} The CSS content as minified.
   */
  min() {
    return this.minified ?
            this :
            new CSS(csso.minify(this.toString()).css, true);
  }
}
exports.CSS = CSS;


/**
 * The class that represents HTML content.
 */
class HTML extends UContent {
  /**
   * @returns {string} The HTML content as minified.
   */
  min() {
    return this.minified ?
            this :
            new HTML(html.minify(this.toString(), htmlOptions), true);
  }
}
exports.HTML = HTML;


/**
 * The class that represents JS content.
 */
class JS extends UContent {
  /**
   * @returns {string} The JS content as minified.
   */
  min() {
    return this.minified ?
            this :
            new JS(uglify.minify(this.toString(), jsOptions).code, true);
  }
}
exports.JS = JS;


/**
 * The class that represents Raw content.
 */
class Raw extends UContent {
  /**
   * @returns {string} The Raw content as is.
   */
  min() {
    return this;
  }
}
exports.Raw = Raw;
