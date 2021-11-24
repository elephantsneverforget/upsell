"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Order = function () {
  function Order() {
    _classCallCheck(this, Order);
  }

  _createClass(Order, [{
    key: "rawOrderFormatter",
    value: function rawOrderFormatter() {
      throw new Error('Must subclass rawOrderFormatter with implementation.');
    }
  }, {
    key: "pushFormattedOrderToDL",
    value: function pushFormattedOrderToDL() {
      window.dataLayer.push(this.formattedOrder);
    }
  }]);

  return Order;
}();

var OCUOrder = function (_Order) {
  _inherits(OCUOrder, _Order);

  var _super = _createSuper(OCUOrder);

  function OCUOrder(dlEventName, affiliation) {
    var _this;

    _classCallCheck(this, OCUOrder);

    _this = _super.call(this);
    _this.dlEventName = dlEventName;
    _this.affiliation = affiliation;
    return _this;
  }

  _createClass(OCUOrder, [{
    key: "generateFormattedOrder",
    value: function generateFormattedOrder(rawOrder) {
      this.rawOrder = rawOrder;
      this.formattedOrder = this.rawOrderFormatter(rawOrder, this.dlEventName);
    }
  }, {
    key: "rawOrderFormatter",
    value: function rawOrderFormatter(rawOrder, dlEventName) {
      var orderFormattedForDL = {
        'event': dlEventName,
        'event_id': this.getOrderId(rawOrder.id),
        'user_properties': this.getUserProperties(),
        'ecommerce': {
          'purchase': {
            'actionField': this.getActionField(),
            'products': this.getLineItems()
          },
          'currencyCode': rawOrder.currency
        }
      };
      return orderFormattedForDL;
    }
  }, {
    key: "getOrderId",
    value: function getOrderId(orderId) {
      return orderId.toString();
    }
  }, {
    key: "getUserProperties",
    value: function getUserProperties() {
      return {
        'customer_id': this.rawOrder.customer.id,
        'customer_email': this.rawOrder.customer.email,
        'customer_first_name': this.rawOrder.customer.firstName,
        'customer_last_name': this.rawOrder.customer.lastName
      };
    }
  }, {
    key: "getDiscountAmount",
    value: function getDiscountAmount() {
      if (this.rawOrder.discounts === null || typeof this.rawOrder.discounts === 'undefined') return '0';
      if (this.rawOrder.discounts.length === 0) return '0';
      return this.rawOrder.discounts.reduce(function (acc, discount) {
        return acc += parseFloat(discount.amount);
      }, 0).toFixed(2).toString();
    }
  }, {
    key: "getActionField",
    value: function getActionField() {
      return {
        'action': "purchase",
        'affiliation': this.affiliation,
        'id': this.getOrderId(this.rawOrder.id),
        'order_name': this.getOrderId(this.rawOrder.number),
        'discount_amount': this.getDiscountAmount(),
        'shipping': (parseFloat(this.rawOrder.totalPrice) - parseFloat(this.rawOrder.subtotalPrice)).toString(),
        'tax': '0',
        'revenue': this.rawOrder.totalPrice,
        'sub_total': this.rawOrder.subtotalPrice
      };
    }
  }, {
    key: "getLineItems",
    value: function getLineItems() {
      return this.rawOrder.lineItems.map(function (item) {
        return {
          'category': item.product.type,
          'variant_id': item.variant.id.toString(),
          'product_id': Number(item.id).toString(),
          'id': item.variant.sku,
          'variant': item.title,
          'name': item.title,
          'price': item.price.toString(),
          'quantity': item.quantity.toString()
        };
      });
    }
  }]);

  return OCUOrder;
}(Order);

var OCUInitialOrder = function (_OCUOrder) {
  _inherits(OCUInitialOrder, _OCUOrder);

  var _super2 = _createSuper(OCUInitialOrder);

  function OCUInitialOrder(initialRawOrder, affiliation) {
    var _thisSuper, _this2;

    _classCallCheck(this, OCUInitialOrder);

    _this2 = _super2.call(this, 'dl_purchase', affiliation);

    _get((_thisSuper = _assertThisInitialized(_this2), _getPrototypeOf(OCUInitialOrder.prototype)), "generateFormattedOrder", _thisSuper).call(_thisSuper, initialRawOrder);

    return _this2;
  }

  return OCUInitialOrder;
}(OCUOrder);

var OCUUpsellOrder = function (_OCUOrder2) {
  _inherits(OCUUpsellOrder, _OCUOrder2);

  var _super3 = _createSuper(OCUUpsellOrder);

  function OCUUpsellOrder(initialRawOrder, upsellRawOrder, upsellCount, affiliation) {
    var _thisSuper2, _this3;

    _classCallCheck(this, OCUUpsellOrder);

    _this3 = _super3.call(this, 'dl_upsell_purchase', affiliation);
    _this3.upsellCount = upsellCount;

    var rawOrder = _this3.createRawOrderFromDiff(initialRawOrder, upsellRawOrder);

    _get((_thisSuper2 = _assertThisInitialized(_this3), _getPrototypeOf(OCUUpsellOrder.prototype)), "generateFormattedOrder", _thisSuper2).call(_thisSuper2, rawOrder);

    return _this3;
  }

  _createClass(OCUUpsellOrder, [{
    key: "createRawOrderFromDiff",
    value: function createRawOrderFromDiff(initialRawOrder, upsellRawOrder) {
      upsellRawOrder = _objectSpread({}, upsellRawOrder);
      initialRawOrder = _objectSpread({}, initialRawOrder);
      var initialOrderItemIds = initialRawOrder.lineItems.map(function (lineItem) {
        return lineItem.id;
      });
      var upsellOrderLineItems = upsellRawOrder.lineItems.filter(function (lineItem) {
        return initialOrderItemIds.indexOf(lineItem.id) < 0;
      });
      var subtotalPrice = this.getAdditionalSubtotal(upsellRawOrder, initialRawOrder);
      var totalPrice = this.getAdditionalRevenue(upsellRawOrder, initialRawOrder);
      delete upsellRawOrder['lineItems'];
      delete upsellRawOrder['subtotalPrice'];
      delete upsellRawOrder['totalPrice'];

      var rawOrder = _objectSpread({
        'lineItems': upsellOrderLineItems,
        subtotalPrice: subtotalPrice,
        totalPrice: totalPrice
      }, upsellRawOrder);

      return rawOrder;
    }
  }, {
    key: "getDiscountAmount",
    value: function getDiscountAmount() {
      if (this.rawOrder.discounts === null || typeof this.rawOrder.discounts === 'undefined') return '0';
      return this.rawOrder.lineItems.reduce(function (acc, addedItem) {
        return acc += parseFloat(addedItem.lineLevelTotalDiscount);
      }, 0).toFixed(2).toString();
    }
  }, {
    key: "getAdditionalRevenue",
    value: function getAdditionalRevenue(newOrder, initialOrder) {
      return (parseFloat(newOrder.totalPrice) - parseFloat(initialOrder.totalPrice)).toFixed(2);
    }
  }, {
    key: "getAdditionalSubtotal",
    value: function getAdditionalSubtotal(newOrder, initialOrder) {
      return (parseFloat(newOrder.subtotalPrice) - parseFloat(initialOrder.subtotalPrice)).toFixed(2);
    }
  }, {
    key: "getOrderId",
    value: function getOrderId(orderId) {
      return orderId.toString() + '-US' + this.upsellCount.toString();
    }
  }]);

  return OCUUpsellOrder;
}(OCUOrder);

function onOrder(initialRawOrder, upsellRawOrder, shopifyObject) {
  var affiliation = getAffiliation(shopifyObject);
  var isUpsell = !!upsellRawOrder;

  if (isUpsell) {
    upsellCount++;
    var upsellOrder = new OCUUpsellOrder(initialRawOrder, upsellRawOrder, upsellCount, affiliation);
    upsellOrder.pushFormattedOrderToDL();
  } else {
    var initialOrder = new OCUInitialOrder(initialRawOrder, affiliation);
    initialOrder.pushFormattedOrderToDL();
  }
}

function getAffiliation(shopifyObject) {
  try {
    return new URL(shopifyObject.pageUrl).hostname;
  } catch (e) {
    return '';
  }
}

try {
  module.exports = exports = {
    onOrder: onOrder,
    resetUpsellCount: function resetUpsellCount() {
      upsellCount = 0;
    },
    Order: Order,
    OCUUpsellOrder: OCUUpsellOrder,
    OCUInitialOrder: OCUInitialOrder
  };
} catch (e) {}

var upsellCount = 0;

(function () {
  if (Shopify.wasPostPurchasePageSeen) {
    var initialRawOrder = window.Shopify.order;
    onOrder(initialRawOrder, null, window.Shopify);
  }

  Shopify.on('CheckoutAmended', function (newRawOrder, initialRawOrder) {
    onOrder(initialRawOrder, newRawOrder, window.Shopify);
  });
})();

(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
  var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-M5VJXQ9');