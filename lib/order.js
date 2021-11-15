"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// eslint-disable-next-line no-unused-vars
var Order = /*#__PURE__*/function () {
  function Order(rawOrder, rawOrderFormatter, dlEventName, upsellCount, shopifyObject) {
    _classCallCheck(this, Order);

    this._shopifyObject = shopifyObject;
    this._rawOrder = rawOrder;
    this._dlEventName = dlEventName;
    this._isUpsell = upsellCount ? upsellCount : 0;
    this._upsellCount = upsellCount;
    this._formattedOrder = rawOrderFormatter(rawOrder, dlEventName, this._isUpsell, upsellCount);
  }

  _createClass(Order, [{
    key: "pushFormattedOrderToDL",
    value: function pushFormattedOrderToDL() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(this.order);
    }
  }]);

  return Order;
}(); // Creates a raw order based on diffing an initial order and upsell order
// eslint-disable-next-line no-unused-vars


function createRawOrderFromDiff(initialRawOrder, upsellRawOrder) {
  upsellRawOrder = _objectSpread({}, upsellRawOrder);
  initialRawOrder = _objectSpread({}, initialRawOrder); // get the new line items that aren't in the previous order

  var initialOrderItemIds = initialRawOrder.lineItems.map(function (lineItem) {
    return lineItem.id;
  });
  var upsellOrderLineItems = upsellRawOrder.lineItems.filter(function (lineItem) {
    return initialOrderItemIds.indexOf(lineItem.id) < 0;
  });
  delete upsellRawOrder['lineItems'];
  delete upsellRawOrder['subtotalPrice'];
  delete upsellRawOrder['totalPrice']; // discount field applies to initial order only.

  delete upsellRawOrder['discounts'];

  var rawOrder = _objectSpread({
    'lineItems': upsellOrderLineItems,
    'subtotalPrice': getAdditionalSubtotal(upsellRawOrder, initialRawOrder),
    'totalPrice': getAdditionalRevenue(upsellRawOrder, initialRawOrder)
  }, upsellRawOrder);

  return rawOrder;
} // Takes an order and formats it for the data layer
// eslint-disable-next-line no-unused-vars


function rawOrderFormatter(rawOrder, dlEventName, isUpsell, upsellCount, shopifyObject) {
  var orderFormattedForDL = {
    'event': dlEventName,
    'event_id': getOrderId(rawOrder.id, isUpsell, upsellCount),
    'user_properties': getUserProperties(rawOrder),
    'ecommerce': {
      'purchase': {
        'actionField': getActionField(rawOrder, isUpsell, shopifyObject),
        'products': getLineItems(rawOrder.lineItems)
      },
      'currencyCode': rawOrder.currency
    }
  };
  return orderFormattedForDL;
} // Returns a user properties object


function getUserProperties(data) {
  return {
    'customer_id': data.customer.id,
    'customer_email': data.customer.email,
    'customer_first_name': data.customer.firstName,
    'customer_last_name': data.customer.lastName
  };
} // Gets line items in purchase


function getLineItems(lineItems) {
  return lineItems.map(function (item) {
    return {
      'category': item.product.type,
      'variant_id': item.variant.id.toString(),
      'product_id': Number(item.id).toString(),
      'id': item.variant.sku,
      // We don't get variant title details
      'variant': item.title,
      'name': item.title,
      'price': item.price.toString(),
      'quantity': item.quantity.toString() // Not available
      // 'brand': orderItem.brand,

    };
  });
}

function getActionField(rawOrder, isUpsell, initialOrder, addedItems, shopifyObject) {
  try {
    affiliation = new URL(shopifyObject.pageUrl).hostname;
  } catch (e) {
    affiliation = '';
  }

  return {
    'action': "purchase",
    'affiliation': affiliation,
    // This is the longer order id that shows in the url on an order page
    'id': getOrderId(rawOrder.id, isUpsell).toString(),
    // This should be the #1240 that shows in order page.
    'order_name': getOrderId(rawOrder.number, isUpsell).toString(),
    // This is total discount. Dollar value, not percentage
    // On the first order we can look at the discounts object. On upsells, we can't.
    // This needs to be a string.
    'discount_amount': getDiscountAmount(rawOrder, isUpsell, addedItems),
    // We can't determine shipping & tax. For the time being put the difference between subtotal and rev in shipping
    'shipping': (parseFloat(rawOrder.totalPrice) - parseFloat(rawOrder.subtotalPrice)).toString(),
    'tax': '0',
    'revenue': rawOrder.totalPrice,
    'sub_total': rawOrder.subtotalPrice
  };
}

function getDiscountAmount(shopifyOrder, isUpsell, addedItems) {
  if (shopifyOrder.discounts === null || typeof shopifyOrder.discounts === 'undefined') return '0';
  if (shopifyOrder.discounts.length === 0) return '0'; // If this isn't an upsell we can look at the discounts object.

  if (!isUpsell) {
    // Collect all the discounts on the first order.
    return shopifyOrder.discounts.reduce(function (acc, discount) {
      return acc += parseFloat(discount.amount);
    }, 0).toFixed(2).toString(); // If this an upsell we have to look at the line item discounts
    // The discount block provided doesn't only applies to the first order.
  } else {
    return addedItems.reduce(function (acc, addedItem) {
      return acc += parseFloat(addedItem.lineLevelTotalDiscount);
    }, 0).toFixed(2).toString();
  }
}

function getAdditionalRevenue(newOrder, initialOrder) {
  return (parseFloat(newOrder.totalPrice) - parseFloat(initialOrder.totalPrice)).toFixed(2);
}

function getAdditionalSubtotal(newOrder, initialOrder) {
  return (parseFloat(newOrder.subtotalPrice) - parseFloat(initialOrder.subtotalPrice)).toFixed(2);
}

function getOrderId(orderId, isUpsell, upsellCount) {
  return isUpsell ? orderId.toString() + '-US' + upsellCount.toString() : orderId;
}

var initialRawOrder = require('./sample_objects/sampleOrderSequenceWithMultipleItemsInInitialOrder/initialOrder');

var upsellRawOrder = require('./sample_objects/sampleOrderSequenceWithMultipleItemsInInitialOrder/firstUpsell');

var rawOrder = createRawOrderFromDiff(initialRawOrder, upsellRawOrder);
console.log(rawOrder);
var order = new Order(rawOrder, rawOrderFormatter, 'dl_purchase');
order.pushFormattedOrderToDL();
module.exports = {
  rawOrderFormatter: rawOrderFormatter,
  createRawOrderFromDiff: createRawOrderFromDiff,
  Order: Order
};