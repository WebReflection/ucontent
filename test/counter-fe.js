const StringifiedHandler = require('stringified-handler');

const {css, html, js} = require('../cjs');

const handler = StringifiedHandler({
  increment({currentTarget: {previousElementSibling}}) {
    previousElementSibling.textContent++;
  },
  decrement({currentTarget: {nextElementSibling}}) {
    nextElementSibling.textContent--;
  }
});

const style = css`
  div.counter {
    font-size: 200%;
  }
  div.counter span {
    width: 4rem;
    display: inline-block;
    text-align: center;
  }
  div.counter button {
    width: 64px;
    height: 64px;
    border: none;
    border-radius: 10px;
    background-color: seagreen;
    color: white;
  }
`;

const view = html`
  <div class="counter">
    <button onclick=${handler.decrement}>-</button>
    <span>0</span>
    <button onclick=${handler.increment}>+</button>
  </div>
`;

module.exports = {
  script: js(handler),
  style,
  view
};
