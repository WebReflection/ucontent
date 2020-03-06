import {CSS, JS, HTML, Raw} from './classes.js';
import {join, parse} from './utils.js';

const cache = new WeakMap;
const define = Class => (template, ...values) => new Class(
  typeof template === 'string' ? template : join(template, values)
);

export const css = define(CSS);
export const js = define(JS);
export const raw = define(Raw);

// this has no meaning here, but it's a "nice to have" in case a library uses
// html, and svg functions passed along so that it works with µhtml or others
export const svg = (template, ...values) => html(template, ...values);

export const html = (template, ...values) => {
  const {length} = values;
  const updates = cache.get(template) || parse(cache, template, length);
  return new HTML(
    length ?
      values.map(update, updates).join('') :
      updates[0]()
  );
};

function update(value, i) {
  return this[i](value);
}
