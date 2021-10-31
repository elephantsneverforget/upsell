// const index = require('./index');
const initialOrder = require('./sample_objects/sampleOrdersWithTax/initialOrder.js')
const firstUpsell = require('./sample_objects/sampleOrdersWithTax/firstUpsell.js')
const secondUpsell = require('./sample_objects/sampleOrdersWithTax/secondUpsell.js')
mockWindow();
const { onCheckoutAmended, onCheckout } = require('./index')
/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  window.dataLayer = [];
})

test('onCheckout adds dl_purchase event to Data Layer', () => {
  onCheckout(initialOrder);
  expect(window.dataLayer.length).toBe(1);
  expect(window.dataLayer[0].event).toMatch('dl_purchase');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.58');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('0.50');
  expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual(1);
  expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('4.50');
});

test('onCheckoutAmended adds dl_purchase event to Data Layer on first upsell with correct incremental revenue and subtotal', () => {
  onCheckoutAmended(firstUpsell, initialOrder);
  expect(window.dataLayer.length).toBe(1);
  expect(window.dataLayer[0].event).toMatch('dl_purchase');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('6.20');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('3.90');
  expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual(2);
  expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
  expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('35.10');
});

test('onCheckoutAmended adds dl_purchase event to Data Layer on second upsell with correct incremental revenue and subtotal', () => {
  onCheckoutAmended(secondUpsell, firstUpsell);
  expect(window.dataLayer.length).toBe(1);
  expect(window.dataLayer[0].event).toMatch('dl_purchase');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.21');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('0.15');
  expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
  expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual(1);
  expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('1.35');
});

function mockWindow() {
  Object.defineProperty(global, "window", {
    value: {
      'dataLayer': [],
    },
    writable: true
  });
  Object.defineProperty(global, "document", {
    value: {
    },
    writable: true
  });
  Object.defineProperty(global, "Shopify", {
    value: {
      wasPostPurchasePageSeen: false,
      'on': function () {}
    },
    writable: true
  });
}