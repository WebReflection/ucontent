import {CSS, JS, HTML, Raw} from './ucontent.js';
import {parse} from './utils.js';

const cache = new WeakMap;

export const css = CSS;
export const js = JS;
export const raw = Raw;

// this has no meaning here, but it's a "nice to have" in case a library uses
// html, and svg functions passed along so that it works with µhtml or others
export const svg = (template, ...values) => html(template, ...values);

export const html = (template, ...values) => {
  const {length} = values;
  const updates = cache.get(template) || parse(cache, template, length);
  return HTML(length ? values.map(update, updates).join('') : updates[0]());
};

function update(value, i) {
  return this[i](value);
}
