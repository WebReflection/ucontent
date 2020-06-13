import csso from 'csso';
import html from 'html-minifier';
import Terser from 'terser';
import umap from 'umap';

const {assign} = Object;

const cache = umap(new WeakMap);

const commonOptions = {
  collapseWhitespace: true,
  preserveLineBreaks: true,
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
    super(String(content)).minified = minified;
  }
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
      cache.set(
        this,
        new CSS(csso.minify(this.toString()).css, true)
      )
    );
  }
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
      cache.set(
        this,
        new HTML(html.minify(this.toString(), htmlOptions), true)
      )
    );
  }
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
      cache.set(
        this,
        new JS(Terser.minify(this.toString(), jsOptions).code, true)
      )
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
      cache.set(
        this,
        new SVG(html.minify(this.toString(), svgOptions), true)
      )
    );
  }
};
