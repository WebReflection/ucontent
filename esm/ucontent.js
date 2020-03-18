import crypto from 'crypto';

import LRU from 'basic-lru';
import csso from 'csso';
import html from 'html-minifier';
import uglify from 'uglify-es';
import umap from 'umap';

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
export class UContent extends String {
  /**
   * 
   * @param {string} content The string representing some content.
   * @param {boolean} [minified] The optional flag to avoid duplicated `min()`.
   */
  constructor(content, minified = false) {
    super(content).minified = minified;
  }
};


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
export class CSS extends UContent {
  /**
   * @returns {CSS} The CSS instance as minified.
   */
  min() {
    return this.minified ? this : (
      cache.get(this) ||
      cache.set(this, minifyCSS(this.toString()))
    );
  }
};


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
export class HTML extends UContent {
  /**
   * @returns {HTML} The HTML instance as minified.
   */
  min() {
    return this.minified ? this : (
      cache.get(this) ||
      cache.set(this, minifyHTML(this.toString()))
    );
  }
};


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
export class JS extends UContent {
  /**
   * @returns {JS} The JS instance as minified.
   */
  min() {
    return this.minified ? this : (
      cache.get(this) ||
      cache.set(this, minifyJS(this.toString()))
    );
  }
};


/**
 * The class that represents Raw content.
 */
export class Raw extends UContent {
  /**
   * @returns {Raw} The Raw content as is.
   */
  min() {
    return this;
  }
};


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
export class SVG extends UContent {
  /**
   * @returns {SVG} The SVG instance as minified.
   */
  min() {
    return this.minified ? this : (
      cache.get(this) ||
      cache.set(this, minifySVG(this.toString()))
    );
  }
};
