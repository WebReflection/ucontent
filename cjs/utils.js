'use strict';
const {escape} = require('html-escaper');
const hyphenizer = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('hyphenizer'));
const instrument = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uparser'));
const umap = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('umap'));

const {CSS, HTML, JS, Raw, SVG} = require('./ucontent.js');

const {keys} = Object;

const inlineStyle = umap(new WeakMap);

const prefix = 'isµ' + Date.now();
const interpolation = new RegExp(
  `(<!--${prefix}(\\d+)-->|\\s*${prefix}(\\d+)=('|")([^\\4]+?)\\4)`, 'g'
);

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

const parse = (template, expectedLength, svg) => {
  const html = instrument(template, prefix, svg).trim();
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
          updates.push(value => {
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
          });
          break;
        case name.slice(0, 2) === 'on':
          updates.push(value => {
            let result = pre;
            // allow listeners only if passed as string
            // or as instance of JS
            if (typeof value === 'string')
              result += attribute(name, quote, value);
            else if (value instanceof JS)
              result += attribute(name, quote, value.min());
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
          ` aria-${hyphenizer(key)}="${value}"`;
}

function data(key) {
  return ` data-${hyphenizer(key)}="${escape(this[key])}"`;
}
