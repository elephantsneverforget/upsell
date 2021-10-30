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



test('onCheckout adds event to DL', () => {
  onCheckout(newOrder);
  expect
  console.log(window.dataLayer);
  onCheckoutAmended(oldOrder, newOrder)
  console.log(window.dataLayer);
  expect(3).toBe(3);
});

function mockWindow() {
  Object.defineProperty(global, "window", {
    value: {
      'dataLayer': [],
      'Shopify': {
        'order': originalOrder,
      },

    },
    writable: true
  });
  Object.defineProperty(global, "Shopify", {
    value: {
      wasPostPurchasePageSeen: false,
      'order': originalOrder,
      'on': function() {return;}
    },
    writable: true
  });
}