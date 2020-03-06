const {css, js, html, raw, svg} = require('../cjs');

const assert = (ucontent, output) => {
  console.assert(ucontent == output, ucontent.toString());
};

assert(html`<div />`, '<div></div>');
assert(html`<div onclick=${Object}/>`, '<div></div>');
assert(html`<div onclick=${Object} onmouseover=${'callback(event)'}/>`, '<div onmouseover="callback(event)"></div>');
assert(svg`<div .contentEditable=${null}/>`, '<div></div>');
assert(html`<div .contentEditable=${false}/>`, '<div></div>');
assert(html`<div .contentEditable=${true}/>`, '<div contenteditable></div>');
assert(html`<div .whatever=${''}/>`, '<div whatever=""></div>');
assert(html`<div escaped=${'"'}/>`, '<div escaped="&quot;"></div>');
assert(html`<div escaped=${null}/>`, '<div></div>');
assert(html`<div data=${{no:1, withHyphens:2}}/>`, '<div data-no="1" data-with-hyphens="2"></div>');
assert(html`<div aria=${{role: 'button', labelledby: 'id'}}/>`, '<div role="button" aria-labelledby="id"></div>');
assert(html`<div>${[1,2].map(n => html`<p>${n}</p>`)}</div>`, '<div><p>1</p><p>2</p></div>');
assert(html`<div>${[1,2].map(n => `<p>${n}</p>`)}</div>`, '<div>&lt;p&gt;1&lt;/p&gt;&lt;p&gt;2&lt;/p&gt;</div>');
assert(html`<div>${{}}</div>`, '<div>[object Object]</div>');

assert(html`<script>${js`function test() { console.log(1); }`}</script>`, '<script>function test(){console.log(1)}</script>');
assert(html`<style>${css`body { font-family: sans-serif; }`}</style>`, '<style>body{font-family:sans-serif}</style>');
assert(html`<div>${raw`<bro"ken />`.min()}</div>`, '<div><bro"ken /></div>');
assert(html`<div>${raw`<bro"ken ${2} />`}</div>`, '<div><bro"ken 2 /></div>');
assert(html`<div  test="${true}"></div>`.min(), '<div test=true></div>');
assert(html`<div  test="${123}"></div>`.min(), '<div test=123></div>');

try {
  html(['', '']);
  console.assert(false, 'not throwing with bad template');
}
catch (e) {}
