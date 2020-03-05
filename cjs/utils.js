'use strict';
const {escape} = require('html-escaper');
const hyphenizer = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('hyphenizer'));
const instrument = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('uparser'));

const {CSS, JS, HTML, Raw} = require('./classes.js');

const {keys} = Object;

const prefix = 'isµ' + Date.now();
const interpolation = new RegExp(
  `(<!--${prefix}(\\d+)-->|\\s*${prefix}(\\d+)=('|")([^\\4]+?)\\4)`, 'g'
);

const attribute = (name, quote, value) =>
                    ` ${name}=${quote}${escape(value)}${quote}`;

const getValue = value => {
  const type = typeof value;

  // quick typeof check to escape by default
  if (type === 'string')
    return escape(value);

  // pass along boolean and numbers as string
  // pass through HTML and Raw instances
  if (
    type === 'boolean' || type === 'number' ||
    value instanceof HTML || value instanceof Raw
  )
    return value.toString();

  // allow Array as interpolation
  if (value instanceof Array)
    return value.map(getValue).join('');

  // minify CSS or JS
  if (value instanceof CSS || value instanceof JS)
    return value.min();

  // last fallback: escape whatever it is
  return escape(String(value));
};

// exports
const join = (tpl, val) => tpl[0] + val.map(chunks, tpl).join('');
exports.join = join;

const parse = (cache, template, expectedLength) => {
  const html = instrument(template, prefix).trim();
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
        case name === 'data':
          updates.push(value => (pre + keys(value).map(data, value).join('')));
          break;
        case name === 'aria':
          updates.push(value => (pre + keys(value).map(aria, value).join('')));
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
            if (typeof value === 'string')
              result += attribute(name, quote, value);
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
  cache.set(template, updates);
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

function chunks(value, i) {
  return value + this[i + 1];
}

function data(key) {
  return ` data-${hyphenizer(key)}="${escape(this[key])}"`;
}
