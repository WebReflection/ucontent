const {css, js, html, raw} = require('../cjs');

const generateHTML = () => html`
<!doctype html>
<script>
function helloWorld() {
  console.log('Hello World 👋');
}
</script>
<style>
body {
  font-family: sans-serif;
}
</style>
<div
  test=${'lol " asd'}
  .contentEditable=${false}
  onclick=${() => 'whatever'}
  onmouseover="${'callback(event)'}"
  data=${{test: 1, otherTest: 2}}
>
  ${[
    html`<p aria=${{role: 'button', labelledby: 'id'}}>Some ${raw`"content"`}</p><hr>`,
    html`<div />`,
    raw`<shena-${'test'}-nigans />`
  ]}
</div>
`;

const generateContent = () => html`
<!doctype html>
<script>${
js`
  function helloWorld() {
    console.log('Hello World 👋');
  }
`}</script>
<style>${
css`
  body {
    font-family: sans-serif;
  }
`}</style>
<div
  test=${'lol " asd'}
  .contentEditable=${false}
  onclick=${() => 'whatever'}
  onmouseover="${'callback(event)'}"
  data=${{test: 1, otherTest: 2}}
>
  ${[
    html`<p aria=${{role: 'button', labelledby: 'id'}}>Some ${raw`"content"`}</p><hr>`,
    html`<div />`,
    raw`<shena-${'test'}-nigans />`
  ]}
</div>
`;

console.time('without CSS/JS optimizations - cold');
const htmlOnly = generateHTML();
console.timeEnd('without CSS/JS optimizations - cold');

console.time('without CSS/JS optimizations - hot');
const htmlHot = generateHTML();
console.timeEnd('without CSS/JS optimizations - hot');

console.time('with CSS/JS optimizations - cold');
const cold = generateContent();
console.timeEnd('with CSS/JS optimizations - cold');

console.time('with CSS/JS optimizations - hot');
const hot = generateContent();
console.timeEnd('with CSS/JS optimizations - hot');

console.time('CSS/JS opt + minified - cold');
const min = cold.min();
console.timeEnd('CSS/JS opt + minified - cold');

console.time('CSS/JS opt + minified - hot');
const minHot = cold.min();
console.timeEnd('CSS/JS opt + minified - hot');

// console.log(cold.toString());
// console.log(min);
