'use strict'

const pelo = require('pelo');
const ucontent = require('../cjs');

const createApp = require('./pelo-app');

const warmup = 100;
const iteration = 10000;

console.log(`# benchmark ${iteration} iterations`);

const ucontentApp = createApp(
  ucontent.html,
  html => html`<button type=submit data=${{'ga-btn': 'Button'}}>Give me!</button>`
);
for (let i = 0; i < warmup; i++) {
  ucontentApp().toString();
}
console.time('ucontent');
for (let i = 0; i < iteration; i++) {
  ucontentApp().toString();
}
console.timeEnd('ucontent');

const peloApp = createApp(
  pelo,
  html => html`<button ${{type: 'submit', 'data-ga-btn': 'Button'}}>Give me!</button>`
);
for (let i = 0; i < warmup; i++) {
  peloApp().toString();
}
console.time('pelo');
for (let i = 0; i < iteration; i++) {
  peloApp().toString();
}
console.timeEnd('pelo');
