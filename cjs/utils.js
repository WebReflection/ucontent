'use strict';
const {escape} = require('html-escaper');
const html = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('html-minifier'));
const uhyphen = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uhyphen'));
const instrument = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uparser'));
const umap = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('umap'));

const {CSS, HTML, JS, Raw, SVG} = require('./ucontent.js');

const {toString} = Function;
const {assign, keys} = Object;

const inlineStyle = umap(new WeakMap);

const prefix = 'isµ' + Date.now();
const interpolation = new RegExp(
  `(<!--${prefix}(\\d+)-->|\\s*${prefix}(\\d+)=('|")([^\\4]+?)\\4)`, 'g'
);

// const attrs = new RegExp(`(${prefix}\\d+)=([^'">\\s]+)`, 'g');

const commonOptions = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  preserveLineBreaks: true,
  preventAttributesEscaping: true,
  removeAttributeQuotes: false,
  removeComments: true,
  ignoreCustomComments: [new RegExp(`${prefix}\\d+`)]
};

const htmlOptions = assign({html5: true}, commonOptions);

const svgOptions = assign({keepClosingSlash: true}, commonOptions);

const attribute = (name, quote, value) =>
                    ` ${name}=${quote}${escape(value)}${quote}`;

const getValue = value => {
  switch (typeof value) {
    case 'string':
      return escape(value);
    case 'boolean':
    case 'number':
      return String(value);
    case 'object':
      switch (true) {
        case value instanceof Array:
          return value.map(getValue).join('');
        case value instanceof HTML:
        case value instanceof Raw:
          return value.toString();
        case value instanceof CSS:
        case value instanceof JS:
        case value instanceof SVG:
          return value.min().toString();
      }
  }
  return value == null ? '' : escape(String(value));
};

const minify = ($, svg, options) => html.minify($, svg ? {...svgOptions, ...options} : {...htmlOptions, ...options});

const parse = (template, expectedLength, svg, minified) => {
  const text = instrument(template, prefix, svg);
  const html = minified ? minify(text, svg, minified) : text;
  const updates = [];
  let i = 0;
  let match = null;
  while (match = interpolation.exec(html)) {
    const pre = html.slice(i, match.index);
    i = match.index + match[0].length;
    if (match[2])
      updates.push(value => (pre + getValue(value)));
    else {
      const name = match[5];
      const quote = match[4];
      switch (true) {
        case name === 'aria':
          updates.push(value => (pre + keys(value).map(aria, value).join('')));
          break;
        case name === 'data':
          updates.push(value => (pre + keys(value).map(data, value).join('')));
          break;
        case name === 'style':
          updates.push(value => {
            let result = pre;
            if (typeof value === 'string')
              result += attribute(name, quote, value);
            if (value instanceof CSS) {
              result += attribute(
                name,
                quote,
                inlineStyle.get(value) ||
                inlineStyle.set(
                  value,
                  new CSS(`style{${value}}`).min().slice(6, -1)
                )
              );
            }
            return result;
          });
          break;
        // setters as boolean attributes (.disabled .contentEditable)
        case name[0] === '.':
          const lower = name.slice(1).toLowerCase();
          updates.push(lower === 'dataset' ?
            (value => (pre + keys(value).map(data, value).join(''))) :
            (value => {
              let result = pre;
              // null, undefined, and false are not shown at all
              if (value != null && value !== false) {
                // true means boolean attribute, just show the name
                if (value === true)
                  result += ` ${lower}`;
                // in all other cases, just escape it in quotes
                else
                  result += attribute(lower, quote, value);
              }
              return result;
            })
          );
          break;
        case name.slice(0, 2) === 'on':
          updates.push(value => {
            let result = pre;
            // allow handleEvent based objects that
            // follow the `onMethod` convention
            // allow listeners only if passed as string,
            // as functions with a special toString method,
            // as objects with handleEvents and a method,
            // or as instance of JS
            switch (typeof value) {
              case 'object':
                if (value instanceof JS) {
                  result += attribute(name, quote, value.min());
                  break;
                }
                if (!(name in value))
                  break;
                value = value[name];
                if (typeof value !== 'function')
                  break;
              case 'function':
                if (value.toString === toString)
                  break;
              case 'string':
                result += attribute(name, quote, value);
                break;
            }
            return result;
          });
          break;
        default:
          updates.push(value => {
            let result = pre;
            if (value != null)
              result += attribute(name, quote, value);
            return result;
          });
          break;
      }
    }
  }
  const {length} = updates;
  if (length !== expectedLength)
    throw new Error(`invalid template ${template}`);
  if (length) {
    const last = updates[length - 1];
    const chunk = html.slice(i);
    updates[length - 1] = value => (last(value) + chunk);
  }
  else
    updates.push(() => html);
  return updates;
};
exports.parse = parse;

// declarations
function aria(key) {
  const value = escape(this[key]);
  return key === 'role' ?
          ` role="${value}"` :
          ` aria-${key.toLowerCase()}="${value}"`;
}

function data(key) {
  return ` data-${uhyphen(key)}="${escape(this[key])}"`;
}
