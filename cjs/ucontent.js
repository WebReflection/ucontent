'use strict';
const csso = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('csso'));
const html = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('html-minifier'));
const uglify = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uglify-es'));
const umap = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('umap'));

const {assign} = Object;

const cache = umap(new WeakMap);

const commonOptions = {
  collapseWhitespace: true,
  preventAttributesEscaping: true,
  removeAttributeQuotes: true,
  removeComments: true
};

const htmlOptions = assign({html5: true}, commonOptions);

const jsOptions = {output: {comments: /^!/}};

const svgOptions = assign({keepClosingSlash: true}, commonOptions);


/**
 * The base class for CSS, HTML, JS, and Raw.
 * @private
 */
class UContent extends String {
  /**
   * 
   * @param {string} content The string representing some content.
   * @param {boolean} [minified] The optional flag to avoid duplicated `min()`.
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
   * @returns {CSS} The CSS instance as minified.
   */
  min() {
    return this.minified ? this : (
      cache.get(this) ||
      cache.set(
        this,
        new CSS(csso.minify(this.toString()).css, true)
      )
    );
  }
}
exports.CSS = CSS;


/**
 * The class that represents HTML content.
 */
class HTML extends UContent {
  /**
   * @returns {HTML} The HTML instance as minified.
   */
  min() {
    return this.minified ? this : (
      cache.get(this) ||
      cache.set(
        this,
        new HTML(html.minify(this.toString(), htmlOptions), true)
      )
    );
  }
}
exports.HTML = HTML;


/**
 * The class that represents JS content.
 */
class JS extends UContent {
  /**
   * @returns {JS} The JS instance as minified.
   */
  min() {
    return this.minified ? this : (
      cache.get(this) ||
      cache.set(
        this,
        new JS(uglify.minify(this.toString(), jsOptions).code, true)
      )
    );
  }
}
exports.JS = JS;


/**
 * The class that represents Raw content.
 */
class Raw extends UContent {
  /**
   * @returns {Raw} The Raw content as is.
   */
  min() {
    return this;
  }
}
exports.Raw = Raw;


/**
 * The class that represents SVG content.
 */
class SVG extends UContent {
  /**
   * @returns {SVG} The SVG instance as minified.
   */
  min() {
    return this.minified ? this : (
      cache.get(this) ||
      cache.set(
        this,
        new SVG(html.minify(this.toString(), svgOptions), true)
      )
    );
  }
}
exports.SVG = SVG;
