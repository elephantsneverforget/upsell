// const index = require('./index');
const initialOrder_1 = require('./sample_objects/sampleOrdersWithTax/initialOrder.js')
const firstUpsell_1 = require('./sample_objects/sampleOrdersWithTax/firstUpsell.js')
const secondUpsell_1 = require('./sample_objects/sampleOrdersWithTax/secondUpsell.js')
const initialOrder_2 = require('./sample_objects/sampleOrdersWithMultipleItems/initialOrder.js')
const firstUpsell_2 = require('./sample_objects/sampleOrdersWithMultipleItems/firstUpsell.js')
const secondUpsell_2 = require('./sample_objects/sampleOrdersWithMultipleItems/secondUpsell.js')
mockWindow();
const { onCheckoutAmended, onCheckout } = require('./index')
/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  window.dataLayer = [];
})
// Tests for orders with single item in initial purchase
test('onCheckout adds dl_purchase event to Data Layer', () => {
  onCheckout(initialOrder_1);
  expect(window.dataLayer.length).toBe(1);
  expect(window.dataLayer[0].event).toMatch('dl_purchase');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.58');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('0.50');
  expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual(1);
  expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('4.50');
});

test('onCheckoutAmended adds dl_purchase event to Data Layer on first upsell with correct incremental revenue and subtotal', () => {
  onCheckoutAmended(firstUpsell_1, initialOrder_1);
  expect(window.dataLayer.length).toBe(1);
  expect(window.dataLayer[0].event).toMatch('dl_upsell_purchase');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('6.20');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('3.90');
  expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual(2);
  expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
  expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('35.10');
});

test('onCheckoutAmended adds dl_purchase event to Data Layer on second upsell with correct incremental revenue and subtotal', () => {
  onCheckoutAmended(secondUpsell_1, firstUpsell_1);
  expect(window.dataLayer.length).toBe(1);
  expect(window.dataLayer[0].event).toMatch('dl_upsell_purchase');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.21');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('0.15');
  expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
  expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual(1);
  expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('1.35');
});

// Tests for order with multiple items in initial purchase.
test('onCheckout adds dl_purchase event to Data Layer', () => {
  onCheckout(initialOrder_2);
  expect(window.dataLayer.length).toBe(1);
  expect(window.dataLayer[0].event).toMatch('dl_purchase');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.58');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('0.50');
  expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual(1);
  expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('4.50');
});

test('onCheckoutAmended adds dl_purchase event to Data Layer on first upsell with correct incremental revenue and subtotal', () => {
  onCheckoutAmended(firstUpsell_2, initialOrder_2);
  expect(window.dataLayer.length).toBe(1);
  expect(window.dataLayer[0].event).toMatch('dl_upsell_purchase');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('6.20');
  expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('3.90');
  expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual(2);
  expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
  expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('35.10');
});

test('onCheckoutAmended adds dl_purchase event to Data Layer on second upsell with correct incremental revenue and subtotal', () => {
  onCheckoutAmended(secondUpsell_2, firstUpsell_2);
  expect(window.dataLayer.length).toBe(1);
  expect(window.dataLayer[0].event).toMatch('dl_upsell_purchase');
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
      'Shopify': {order:''}
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


