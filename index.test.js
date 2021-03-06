/**
 * @jest-environment jsdom
 */
const initialOrder_1 = require('./sample_objects/sampleOrderSequenceWithTax/initialOrder.js')
const firstUpsell_1 = require('./sample_objects/sampleOrderSequenceWithTax/firstUpsell.js')
const secondUpsell_1 = require('./sample_objects/sampleOrderSequenceWithTax/secondUpsell.js')
const initialOrder_2 = require('./sample_objects/sampleOrderSequenceWithMultipleItemsInInitialOrder/initialOrder.js')
const firstUpsell_2 = require('./sample_objects/sampleOrderSequenceWithMultipleItemsInInitialOrder/firstUpsell.js')
const secondUpsell_2 = require('./sample_objects/sampleOrderSequenceWithMultipleItemsInInitialOrder/secondUpsell.js')
const initialOrder_3 = require('./sample_objects/cartHookSampleOrderSequenceNoDiscounts/initialOrder.js')
const firstUpsell_3 = require('./sample_objects/cartHookSampleOrderSequenceNoDiscounts/firstUpsell.js')
const secondUpsell_3 = require('./sample_objects/cartHookSampleOrderSequenceNoDiscounts/secondUpsell.js')
const oneOff_1 = require('./sample_objects/oneOffSamples/orderWith0DollarItem.js')
const oneOff_2 = require('./sample_objects/oneOffSamples/orderWithMultipleDiscounts.js')
const shopifyObject = require('./sample_objects/shopifyObjectOnUpsellPages.js');
mockWindow();
const { onCheckoutAmended, onCheckout, resetUpsellCount } = require('./index')

beforeEach(() => {
  window.dataLayer = [];
})
// Tests for orders with single item in initial purchase
describe('Sample order set 1', () => {
  test('onCheckout adds dl_purchase event to Data Layer', () => {
    onCheckout(initialOrder_1, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_purchase');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.affiliation).toEqual('store.getelevar.com');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.58');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('0.50');
    expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual('1');
    expect(window.dataLayer[0].ecommerce.purchase.products[0].product_id).toEqual('6791661453348');
    expect(window.dataLayer[0].ecommerce.purchase.products[0].variant_id).toEqual('39663258009636');
    expect(window.dataLayer[0].ecommerce.purchase.products[0].id).toEqual('test123');
    expect(window.dataLayer[0].ecommerce.purchase.products[1]).toBeUndefined();
    expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('4.50');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.id).toEqual(expect.not.stringContaining('-US'));
  });

  test('onCheckoutAmended adds dl_upsell_purchase event to Data Layer on first upsell with correct incremental revenue and subtotal', () => {
    onCheckoutAmended(firstUpsell_1, initialOrder_1, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_upsell_purchase');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('6.20');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('3.90');
    expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual('2');
    expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
    expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('35.10');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.id).toEqual(expect.stringContaining('-US1'));
  });

  test('onCheckoutAmended adds dl_upsell_purchase event to Data Layer on second upsell with correct incremental revenue and subtotal', () => {
    onCheckoutAmended(secondUpsell_1, firstUpsell_1, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_upsell_purchase');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.21');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('0.15');
    expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
    expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual('1');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('1.35');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.id).toEqual(expect.stringContaining('-US2'));
  });
})

describe('Sample order set 2', () => {
  // Tests for order with multiple items in initial purchase.
  test('onCheckout adds dl_purchase event to Data Layer with multiple items in initial order', () => {
    resetUpsellCount();
    onCheckout(initialOrder_2, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_purchase');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.37');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('0.30');
    expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual('1');
    expect(window.dataLayer[0].ecommerce.purchase.products[1].quantity).toEqual('1');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('2.70');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.id).toEqual(expect.not.stringContaining('-US'));
  });

  test('onCheckoutAmended adds dl_upsell_purchase event to Data Layer on first upsell with correct incremental revenue and subtotal with multiple items in order', () => {
    onCheckoutAmended(firstUpsell_2, initialOrder_2, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_upsell_purchase');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('6.20');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('3.90');
    expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual('2');
    expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
    expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('35.10');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.id).toEqual(expect.stringContaining('-US1'));
  });

  test('onCheckoutAmended adds dl_upsell_purchase event to Data Layer on second upsell with correct incremental revenue and subtotal with multiple items in order', () => {
    onCheckoutAmended(secondUpsell_2, firstUpsell_2, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_upsell_purchase');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.21');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('0.15');
    expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
    expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual('1');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('1.35');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.id).toEqual(expect.stringContaining('-US2'));
  });
})

describe('Sample order set 3', () => {
  // Tests for orders where discount is null.
  test('onCheckout adds dl_purchase event to Data Layer with multiple items in initial order', () => {
    resetUpsellCount();
    onCheckout(initialOrder_3, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_purchase');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('2.63');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('1.50');
    expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual('1');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('0');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.id).toEqual(expect.not.stringContaining('-US'));
  });

  test('onCheckoutAmended adds dl_upsell_purchase event to Data Layer on first upsell with correct incremental revenue and subtotal with multiple items in order', () => {
    onCheckoutAmended(firstUpsell_3, initialOrder_3, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_upsell_purchase');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.58');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('1.50');
    expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
    expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('0');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.id).toEqual(expect.stringContaining('-US1'));
  });

  test('onCheckoutAmended adds dl_upsell_purchase event to Data Layer on second upsell with correct incremental revenue and subtotal with multiple items in order', () => {
    onCheckoutAmended(secondUpsell_3, firstUpsell_3, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_upsell_purchase');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.revenue).toEqual('1.58');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.sub_total).toEqual('1.50');
    expect(window.dataLayer[0].ecommerce.purchase.products.length).toEqual(1);
    expect(window.dataLayer[0].ecommerce.purchase.products[0].quantity).toEqual('1');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.discount_amount).toEqual('0');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.id).toEqual(expect.stringContaining('-US2'));
  });
})

describe('One off weird order 1. product with $0 line item still pushes to data layer', () => {
  // Tests for orders where discount is null.
  test('onCheckout adds dl_purchase event to Data Layer', () => {
    resetUpsellCount();
    onCheckout(oneOff_1, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_purchase');
  });
})

describe('One off weird order 2. product with multiple discounts', () => {
  // Tests for orders where discount is null.
  test('All discount codes are listed in the coupon property', () => {
    resetUpsellCount();
    onCheckout(oneOff_2, shopifyObject);
    expect(window.dataLayer.length).toBe(1);
    expect(window.dataLayer[0].event).toMatch('dl_purchase');
    expect(window.dataLayer[0].ecommerce.purchase.actionField.coupon).toEqual('90OFF 10OFF');
  });
})


function mockWindow() {
  Object.defineProperty(global, "window", {
    value: {
      'dataLayer': [],
      'Shopify': { order: '' }
    },
    writable: true
  });
  Object.defineProperty(global, "document", {
    value: {
      getElementsByTagName: () => [{
        parentNode: {
          insertBefore: () => { },
        }
      }],
      createElement: function () {
        return { async: true };
      }
    },
    writable: true
  });
  Object.defineProperty(global, "Shopify", {
    value: {
      wasPostPurchasePageSeen: true,
      'on': function () { }
    },
    writable: true
  });
}


