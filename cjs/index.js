'use strict';
const {CSS, JS, HTML, Raw} = require('./ucontent.js');
const {parse} = require('./utils.js');

const cache = new WeakMap;

const css = CSS;
exports.css = css;
const js = JS;
exports.js = js;
const raw = Raw;
exports.raw = raw;

// this has no meaning here, but it's a "nice to have" in case a library uses
// html, and svg functions passed along so that it works with µhtml or others
const svg = (template, ...values) => html(template, ...values);
exports.svg = svg;

const html = (template, ...values) => {
  const {length} = values;
  const updates = cache.get(template) || parse(cache, template, length);
  return HTML(length ? values.map(update, updates).join('') : updates[0]());
};
exports.html = html;

function update(value, i) {
  return this[i](value);
}
