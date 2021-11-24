"use strict";function _typeof(e){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)}function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach((function(t){_defineProperty(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _get(){return _get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,r){var n=_superPropBase(e,t);if(n){var o=Object.getOwnPropertyDescriptor(n,t);return o.get?o.get.call(arguments.length<3?e:r):o.value}},_get.apply(this,arguments)}function _superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=_getPrototypeOf(e)););return e}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return _setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},_setPrototypeOf(e,t)}function _createSuper(e){var t=_isNativeReflectConstruct();return function(){var r,n=_getPrototypeOf(e);if(t){var o=_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return _possibleConstructorReturn(this,r)}}function _possibleConstructorReturn(e,t){if(t&&("object"===_typeof(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(e)}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function _getPrototypeOf(e){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},_getPrototypeOf(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}var Order=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"rawOrderFormatter",value:function(){throw new Error("Must subclass rawOrderFormatter with implementation.")}},{key:"pushFormattedOrderToDL",value:function(){window.dataLayer.push(this.formattedOrder)}}]),e}(),OCUOrder=function(e){_inherits(r,Order);var t=_createSuper(r);function r(e,n){var o;return _classCallCheck(this,r),(o=t.call(this)).dlEventName=e,o.affiliation=n,o}return _createClass(r,[{key:"generateFormattedOrder",value:function(e){this.rawOrder=e,this.formattedOrder=this.rawOrderFormatter(e,this.dlEventName)}},{key:"rawOrderFormatter",value:function(e,t){return{event:t,event_id:this.getOrderId(e.id),user_properties:this.getUserProperties(),ecommerce:{purchase:{actionField:this.getActionField(),products:this.getLineItems()},currencyCode:e.currency}}}},{key:"getOrderId",value:function(e){return e.toString()}},{key:"getUserProperties",value:function(){return{customer_id:this.rawOrder.customer.id,customer_email:this.rawOrder.customer.email,customer_first_name:this.rawOrder.customer.firstName,customer_last_name:this.rawOrder.customer.lastName}}},{key:"getDiscountAmount",value:function(){return null===this.rawOrder.discounts||void 0===this.rawOrder.discounts||0===this.rawOrder.discounts.length?"0":this.rawOrder.discounts.reduce((function(e,t){return e+parseFloat(t.amount)}),0).toFixed(2).toString()}},{key:"getActionField",value:function(){return{action:"purchase",affiliation:this.affiliation,id:this.getOrderId(this.rawOrder.id),order_name:this.getOrderId(this.rawOrder.number),discount_amount:this.getDiscountAmount(),shipping:(parseFloat(this.rawOrder.totalPrice)-parseFloat(this.rawOrder.subtotalPrice)).toString(),tax:"0",revenue:this.rawOrder.totalPrice,sub_total:this.rawOrder.subtotalPrice}}},{key:"getLineItems",value:function(){return this.rawOrder.lineItems.map((function(e){return{category:e.product.type,variant_id:e.variant.id.toString(),product_id:Number(e.id).toString(),id:e.variant.sku,variant:e.title,name:e.title,price:e.price.toString(),quantity:e.quantity.toString()}}))}}]),r}(),OCUInitialOrder=function(e){_inherits(r,OCUOrder);var t=_createSuper(r);function r(e,n){var o,i;return _classCallCheck(this,r),_get((o=_assertThisInitialized(i=t.call(this,"dl_purchase",n)),_getPrototypeOf(r.prototype)),"generateFormattedOrder",o).call(o,e),i}return r}(),OCUUpsellOrder=function(e){_inherits(r,OCUOrder);var t=_createSuper(r);function r(e,n,o,i){var a,u;_classCallCheck(this,r),(u=t.call(this,"dl_upsell_purchase",i)).upsellCount=o;var s=u.createRawOrderFromDiff(e,n);return _get((a=_assertThisInitialized(u),_getPrototypeOf(r.prototype)),"generateFormattedOrder",a).call(a,s),u}return _createClass(r,[{key:"createRawOrderFromDiff",value:function(e,t){t=_objectSpread({},t);var r=(e=_objectSpread({},e)).lineItems.map((function(e){return e.id})),n=t.lineItems.filter((function(e){return r.indexOf(e.id)<0})),o=this.getAdditionalSubtotal(t,e),i=this.getAdditionalRevenue(t,e);return delete t.lineItems,delete t.subtotalPrice,delete t.totalPrice,_objectSpread({lineItems:n,subtotalPrice:o,totalPrice:i},t)}},{key:"getDiscountAmount",value:function(){return null===this.rawOrder.discounts||void 0===this.rawOrder.discounts?"0":this.rawOrder.lineItems.reduce((function(e,t){return e+parseFloat(t.lineLevelTotalDiscount)}),0).toFixed(2).toString()}},{key:"getAdditionalRevenue",value:function(e,t){return(parseFloat(e.totalPrice)-parseFloat(t.totalPrice)).toFixed(2)}},{key:"getAdditionalSubtotal",value:function(e,t){return(parseFloat(e.subtotalPrice)-parseFloat(t.subtotalPrice)).toFixed(2)}},{key:"getOrderId",value:function(e){return e.toString()+"-US"+this.upsellCount.toString()}}]),r}();function onOrder(e,t,r){var n=getAffiliation(r);!t?new OCUInitialOrder(e,n).pushFormattedOrderToDL():(upsellCount++,new OCUUpsellOrder(e,t,upsellCount,n).pushFormattedOrderToDL())}function getAffiliation(e){try{return new URL(e.pageUrl).hostname}catch(e){return""}}try{module.exports=exports={onOrder:onOrder,resetUpsellCount:function(){upsellCount=0},Order:Order,OCUUpsellOrder:OCUUpsellOrder,OCUInitialOrder:OCUInitialOrder}}catch(e){}var upsellCount=0;!function(){Shopify.wasPostPurchasePageSeen&&onOrder(window.Shopify.order,null,window.Shopify);Shopify.on("CheckoutAmended",(function(e,t){onOrder(t,e,window.Shopify)}))}(),function(e,t,r,n,o){e[n]=e[n]||[],e[n].push({"gtm.start":(new Date).getTime(),event:"gtm.js"});var i=t.getElementsByTagName(r)[0],a=t.createElement(r);a.async=!0,a.src="https://www.googletagmanager.com/gtm.js?id=GTM-M5VJXQ9",i.parentNode.insertBefore(a,i)}(window,document,"script","dataLayer");