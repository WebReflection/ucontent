const {render, css, js, html, raw, svg} = require('../cjs');

const assert = (ucontent, output) => {
  console.assert(ucontent == output, ucontent.toString());
};

assert(html`<div />`, '<div></div>');
assert(html`<div onclick=${Object}/>`, '<div></div>');
assert(html`<div onclick=${Object} onmouseover=${'callback(event)'}/>`, '<div onmouseover="callback(event)"></div>');
assert(svg`<div .contentEditable=${null} />`, '<div />');
assert(html`<div .contentEditable=${false}/>`, '<div></div>');
assert(html`<div .contentEditable=${true}/>`, '<div contenteditable></div>');
assert(html`<div .whatever=${''}/>`, '<div whatever=""></div>');
assert(html`<div escaped=${'"'}/>`, '<div escaped="&quot;"></div>');
assert(html`<div escaped=${null}/>`, '<div></div>');
const rect = svg.for({})`<rect />`;
assert(html.node`<div>${rect}</div>`, '<div><rect/></div>');
assert(html`<svg>${rect}</svg>`, '<svg><rect/></svg>');
assert(html`<svg>${rect.min().min()}</svg>`, '<svg><rect/></svg>');
assert(html`<div>${Buffer.from('"')}</div>`, '<div>&quot;</div>');
assert(html`<div>${new String('"')}</div>`, '<div>&quot;</div>');
assert(html`<div data=${{no:1, withHyphens:2}}/>`, '<div data-no="1" data-with-hyphens="2"></div>');
assert(html`<div aria=${{role: 'button', labelledby: 'id'}}/>`, '<div role="button" aria-labelledby="id"></div>');
assert(html`<div>${[1,2].map(n => html`<p>${n}</p>`)}</div>`, '<div><p>1</p><p>2</p></div>');
assert(html`<div>${[1,2].map(n => `<p>${n}</p>`)}</div>`, '<div>&lt;p&gt;1&lt;/p&gt;&lt;p&gt;2&lt;/p&gt;</div>');
assert(html`<div>${{}}</div>`, '<div>[object Object]</div>');
assert(html`<div>${null}</div>`, '<div></div>');
assert(html`<div>${void 0}</div>`, '<div></div>');
assert(html`<div>${true}</div>`, '<div>true</div>');
assert(html.for({})`<div>${123}</div>`, '<div>123</div>');

assert(html`<script>${js`function test() { console.log(1); }`.min().min()}</script>`, '<script>function test(){console.log(1)}</script>');
assert(html`<script>${js(function test() { console.log(0); }).min().min()}</script>`, '<script>function test(){console.log(0)}</script>');
assert(html`<style>${css`body { font-family: sans-serif; }`.min().min()}</style>`, '<style>body{font-family:sans-serif}</style>');
assert(html`<div>${raw`<bro"ken />`.min().min()}</div>`, '<div><bro"ken /></div>');
assert(html`<div>${raw`<bro"ken ${2} />`}</div>`, '<div><bro"ken 2 /></div>');
assert(html`<div>${raw('<bro"ken />')}</div>`, '<div><bro"ken /></div>');
assert(html`<div  test="${true}"></div>`.min().min(), '<div test=true></div>');
assert(html`<div  test="${123}"></div>`.min(), '<div test=123></div>');
assert(html`<div onclick="${js`alert(1)`}"></div>`.min(), '<div onclick=alert(1);></div>');
const inlineStyle = css`font-family: sans-serif`;
assert(html`<div style="${inlineStyle}"></div>`, '<div style="font-family:sans-serif"></div>');
assert(html`<div style="${inlineStyle}"></div>`, '<div style="font-family:sans-serif"></div>');
assert(html`<div style="${'font-family: sans-serif'}"></div>`, '<div style="font-family: sans-serif"></div>');

const fn = () => {};
fn.toString = () => 'console.log("test")';
assert(html`<div onclick=${fn}></div>`, '<div onclick="console.log(&quot;test&quot;)"></div>');

try {
  html(['', '']);
  console.assert(false, 'not throwing with bad template');
}
catch (e) {}

let outerContent = '';
const callback = content => (outerContent = content);
const server = {write(content) { this.content = content; }};

assert(render(callback, html`<p />`), outerContent);
assert(outerContent, '<p></p>');

render(server, html`<p />`);
assert(server.content, '<p></p>');

assert(render(server, () => html`<div />`), server);
assert(server.content, '<div></div>');

html.minified = true;
svg.minified = true;

assert(html`<div />`, '<div></div>');
assert(html`<div onclick=${Object}/>`, '<div></div>');
assert(html`<div onclick=${Object} onmouseover=${'callback(event)'}/>`, '<div onmouseover="callback(event)"></div>');
assert(svg`<div .contentEditable=${null} />`, '<div/>');
assert(html`<div .contentEditable=${false}/>`, '<div></div>');
assert(html`<div .contentEditable=${true}/>`, '<div contenteditable></div>');
assert(html`<div .whatever=${''}/>`, '<div whatever=""></div>');
assert(html`<div escaped=${'"'}/>`, '<div escaped="&quot;"></div>');
assert(html`<div escaped=${null}/>`, '<div></div>');
const mrect = svg.for({})`<rect />`;
assert(html.node`<div>${mrect}</div>`, '<div><rect/></div>');
assert(html`<svg>${mrect}</svg>`, '<svg><rect/></svg>');
assert(html`<div>${Buffer.from('"')}</div>`, '<div>&quot;</div>');
assert(html`<div>${new String('"')}</div>`, '<div>&quot;</div>');
assert(html`<div data=${{no:1, withHyphens:2}}/>`, '<div data-no="1" data-with-hyphens="2"></div>');
assert(html`<div aria=${{role: 'button', labelledby: 'id'}}/>`, '<div role="button" aria-labelledby="id"></div>');
assert(html`<div>${[1,2].map(n => html`<p>${n}</p>`)}</div>`, '<div><p>1</p><p>2</p></div>');
assert(html`<div>${[1,2].map(n => `<p>${n}</p>`)}</div>`, '<div>&lt;p&gt;1&lt;/p&gt;&lt;p&gt;2&lt;/p&gt;</div>');
assert(html`<div>${{}}</div>`, '<div>[object Object]</div>');
assert(html`<div>${null}</div>`, '<div></div>');
assert(html`<div>${void 0}</div>`, '<div></div>');
assert(html`<div>${true}</div>`, '<div>true</div>');
assert(html.for({})`<div>${123}</div>`, '<div>123</div>');

const handler1 = {};
assert(html`<div onclick=${handler1} />`, '<div></div>');

const onclick = () => {};
onclick.toString = () => 'test';
const handler2 = {onclick};
assert(html`<div onclick=${handler2} />`, '<div onclick="test"></div>');

const handler3 = {onclick: true};
assert(html`<div onclick=${handler3} />`, '<div></div>');
