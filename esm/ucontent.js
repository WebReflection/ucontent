import csso from 'csso';
import html from 'html-minifier';
import uglify from 'uglify-es';

const htmlOptions = {
  collapseWhitespace: true,
  html5: true,
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


/**
 * The class that represents CSS content.
 */
export class CSS extends UContent {
  /**
   * @returns {CSS} The CSS instance as minified.
   */
  min() {
    return this.minified ?
            this :
            new CSS(csso.minify(this.toString()).css, true);
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
    return this.minified ?
            this :
            new HTML(html.minify(this.toString(), htmlOptions), true);
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
    return this.minified ?
            this :
            new JS(uglify.minify(this.toString(), jsOptions).code, true);
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
