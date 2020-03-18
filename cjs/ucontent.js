'use strict';
const crypto = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('crypto'));

const LRU = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('basic-lru'));
const csso = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('csso'));
const html = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('html-minifier'));
const uglify = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uglify-es'));
const umap = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('umap'));

const hash = text => crypto.createHash('sha256').update(text).digest('base64');

const {assign} = Object;

const cache = umap(new WeakMap);
const minified = umap(new LRU({maxSize: 100, maxAge: 10000}));

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


const minifyCSS = text => {
  const sha = hash(text);
  return (
    minified.get(sha) ||
    minified.set(sha, new CSS(csso.minify(text).css, true))
  );
};

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
      cache.set(this, minifyCSS(this.toString()))
    );
  }
}
exports.CSS = CSS;


const minifyHTML = text => {
  const sha = hash(text);
  return (
    minified.get(sha) ||
    minified.set(sha, new HTML(html.minify(text, htmlOptions), true))
  );
};

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
      cache.set(this, minifyHTML(this.toString()))
    );
  }
}
exports.HTML = HTML;


const minifyJS = text => {
  const sha = hash(text);
  return (
    minified.get(sha) ||
    minified.set(sha, new JS(uglify.minify(text, jsOptions).code, true))
  );
};

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
      cache.set(this, minifyJS(this.toString()))
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


const minifySVG = text => {
  const sha = hash(text);
  return (
    minified.get(sha) ||
    minified.set(sha, new SVG(html.minify(text, svgOptions), true))
  );
};

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
      cache.set(this, minifySVG(this.toString()))
    );
  }
}
exports.SVG = SVG;
