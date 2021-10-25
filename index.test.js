// const index = require('./index');
const oldOrder = require('./previousOrder')
const newOrder = require('./newOrder')
const originalOrder = require('./shopifyOrderObjectOnPostPurchasePage')
mockWindow();
const { onCheckoutAmended, onCheckout } = require('./index')
/**
 * @jest-environment jsdom
 */
// console.log(oldOrder);
// console.log(newOrder);



test('adds 1 + 2 to equal 3', () => {
  onCheckout(newOrder.default);
  console.log(window.dataLayer);
  onCheckoutAmended(oldOrder.default, newOrder.default)
  console.log(window.dataLayer);
  expect(3).toBe(3);
});

function mockWindow() {
  Object.defineProperty(global, "window", {
    value: {
      'dataLayer': [],
      'Shopify': {
        'order': originalOrder.default,
      },

    },
    writable: true
  });
  Object.defineProperty(global, "Shopify", {
    value: {
      wasPostPurchasePageSeen: false,
      'order': originalOrder.default,
      'on': function() {return;}
    },
    writable: true
  });
}