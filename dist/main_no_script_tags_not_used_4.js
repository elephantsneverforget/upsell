function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

var Order = function () {
  function Order(conts) {
    _classCallCheck(this, Order);

    Object.assign(this, conts);
  }

  _createClass(Order, [{
    key: "rawOrderFormatter",
    value: function rawOrderFormatter() {
      throw new Error("Must subclass rawOrderFormatter with implementation.");
    }
  }, {
    key: "pushFormattedOrderToDL",
    value: function pushFormattedOrderToDL() {
      var formattedOrder = this.rawOrderFormatter(this.rawOrder);
      window.dataLayer.push(formattedOrder);
    }
  }]);

  return Order;
}();

var OCUOrder = function (_Order) {
  _inherits(OCUOrder, _Order);

  var _super = _createSuper(OCUOrder);

  function OCUOrder() {
    _classCallCheck(this, OCUOrder);

    return _super.apply(this, arguments);
  }

  _createClass(OCUOrder, [{
    key: "rawOrderFormatter",
    value: function rawOrderFormatter(rawOrder) {
      var orderFormattedForDL = {
        event: this.dlEventName,
        event_id: this.getOrderId(rawOrder.id),
        user_properties: this.getUserProperties(),
        ecommerce: {
          purchase: {
            actionField: this.getActionField(),
            products: this.getLineItems()
          },
          currencyCode: rawOrder.currency
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
        customer_id: this.rawOrder.customer.id,
        customer_email: this.rawOrder.customer.email,
        customer_first_name: this.rawOrder.customer.firstName,
        customer_last_name: this.rawOrder.customer.lastName
      };
    }
  }, {
    key: "getDiscountAmount",
    value: function getDiscountAmount() {
      if (this.rawOrder.discounts === null || typeof this.rawOrder.discounts === "undefined") return "0";
      if (this.rawOrder.discounts.length === 0) return "0";
      return this.rawOrder.discounts.reduce(function (acc, discount) {
        return acc += parseFloat(discount.amount);
      }, 0).toFixed(2).toString();
    }
  }, {
    key: "getActionField",
    value: function getActionField() {
      return {
        action: "purchase",
        affiliation: this.affiliation,
        id: this.getOrderId(this.rawOrder.id),
        order_name: this.getOrderId(this.rawOrder.number),
        discount_amount: this.getDiscountAmount(),
        shipping: (parseFloat(this.rawOrder.totalPrice) - parseFloat(this.rawOrder.subtotalPrice)).toString(),
        tax: "0",
        revenue: this.rawOrder.totalPrice,
        sub_total: this.rawOrder.subtotalPrice
      };
    }
  }, {
    key: "getLineItems",
    value: function getLineItems() {
      return this.rawOrder.lineItems.map(function (item) {
        return {
          category: item.product.type,
          variant_id: item.variant.id.toString(),
          product_id: Number(item.product.id).toString(),
          id: item.variant.sku,
          variant: item.title,
          name: item.title,
          price: item.price.toString(),
          quantity: item.quantity.toString()
        };
      });
    }
  }]);

  return OCUOrder;
}(Order);
var OCUUpsellOrder = function (_OCUOrder) {
  _inherits(OCUUpsellOrder, _OCUOrder);

  var _super2 = _createSuper(OCUUpsellOrder);

  function OCUUpsellOrder(args) {
    var _this;

    _classCallCheck(this, OCUUpsellOrder);

    var rawOrder = OCUUpsellOrder.createRawOrderFromDiff(args.rawOrder, args.upsellRawOrder);
    _this = _super2.call(this, Object.assign(args, {
      rawOrder: rawOrder
    }));
    _this.upsellCount = args.upsellCount;
    return _this;
  }

  _createClass(OCUUpsellOrder, [{
    key: "getDiscountAmount",
    value: function getDiscountAmount() {
      if (this.rawOrder.discounts === null || typeof this.rawOrder.discounts === "undefined") return "0";
      return this.rawOrder.lineItems.reduce(function (acc, addedItem) {
        return acc += parseFloat(addedItem.lineLevelTotalDiscount);
      }, 0).toFixed(2).toString();
    }
  }, {
    key: "getOrderId",
    value: function getOrderId(orderId) {
      return orderId.toString() + "-US" + this.upsellCount.toString();
    }
  }], [{
    key: "createRawOrderFromDiff",
    value: function createRawOrderFromDiff(initialRawOrder, upsellRawOrder) {
      upsellRawOrder = _objectSpread2({}, upsellRawOrder);
      initialRawOrder = _objectSpread2({}, initialRawOrder);
      var initialOrderItemIds = initialRawOrder.lineItems.map(function (lineItem) {
        return lineItem.id;
      });
      var upsellOrderLineItems = upsellRawOrder.lineItems.filter(function (lineItem) {
        return initialOrderItemIds.indexOf(lineItem.id) < 0;
      });
      var subtotalPrice = OCUUpsellOrder.getAdditionalSubtotal(upsellRawOrder, initialRawOrder);
      var totalPrice = OCUUpsellOrder.getAdditionalRevenue(upsellRawOrder, initialRawOrder);
      delete upsellRawOrder["lineItems"];
      delete upsellRawOrder["subtotalPrice"];
      delete upsellRawOrder["totalPrice"];

      var rawOrder = _objectSpread2({
        lineItems: upsellOrderLineItems,
        subtotalPrice: subtotalPrice,
        totalPrice: totalPrice
      }, upsellRawOrder);

      return rawOrder;
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
  }]);

  return OCUUpsellOrder;
}(OCUOrder);

function onOrder(initialRawOrder, upsellRawOrder, shopifyObject) {
  var affiliation = getAffiliation(shopifyObject);
  var isUpsell = !!upsellRawOrder;

  if (isUpsell) {
    upsellCount++;
    var args = {
      rawOrder: initialRawOrder,
      upsellRawOrder: upsellRawOrder,
      upsellCount: upsellCount,
      affiliation: affiliation,
      dlEventName: 'dl_upsell_purchase'
    };
    var upsellOrder = new OCUUpsellOrder(args);
    upsellOrder.pushFormattedOrderToDL();
  } else {
    var _args = {
      rawOrder: initialRawOrder,
      affiliation: affiliation,
      dlEventName: 'dl_purchase'
    };
    var initialOrder = new OCUOrder(_args);
    initialOrder.pushFormattedOrderToDL();
  }
}

function getAffiliation(shopifyObject) {
  try {
    return new URL(shopifyObject.pageUrl).hostname;
  } catch (e) {
    return "";
  }
}

try {
  module.exports = exports = {
    onOrder: onOrder,
    resetUpsellCount: function resetUpsellCount() {
      upsellCount = 0;
    }
  };
} catch (e) {}

var upsellCount = 0;

(function (w, d, s, l, i) {
  w[l] = w[l] || []; w[l].push({
      'gtm.start':
          new Date().getTime(), event: 'gtm.js'
  }); var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
          'https://sstagging.beautybyearth.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-KQ8R2LQ');