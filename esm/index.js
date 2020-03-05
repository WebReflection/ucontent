import {CSS, JS, HTML, Raw} from './classes.js';
import {join, parse} from './utils.js';

const cache = new WeakMap;

export const css = (template, ...values) => new CSS(join(template, values));

export const js = (template, ...values) => new JS(join(template, values));

export const html = (template, ...values) => {
  const {length} = values;
  const updates = cache.get(template) || parse(cache, template, length);
  return new HTML(
    length ?
      values.map(update, updates).join('') :
      updates[0]()
  );
};

export const raw = (template, ...values) => new Raw(join(template, values));

function update(value, i) {
  return this[i](value);
}