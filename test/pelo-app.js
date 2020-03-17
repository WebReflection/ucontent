'use strict'

module.exports = function (html, button) {

  const greeting = 'Hello';
  const name = 'special characters, <, >, &';
  const drinks = [
      { name: 'Cafe Latte', price: 3.0, sold: false },
      { name: 'Cappucino', price: 2.9, sold: true },
      { name: 'Club Mate', price: 2.2, sold: true },
      { name: 'Berliner Weiße', price: 3.5, sold: false }
  ];

function drinkView (drink) {
  return html`
    <li>
      ${drink.name} is € ${drink.price}
      ${button(html)}
    </li>
  `;
}

function mainView (greeting, name, drinks) {
  return html`
    <div>
      <p>${greeting}, ${name}!</p>
      ${drinks.length > 0 ? html`
        <ul>
          ${drinks.map(drink => drinkView(drink))}
        </ul>
      ` : html`
        <p>All drinks are gone!</p>
      `}
      <p>
        attributes: <input type=text value=${''} disabled />
      </p>
    </div>
  `;
}

  return function render () {
    return mainView(greeting, name, drinks)
  };
};
