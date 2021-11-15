// EVENT HOOKS -----------------------------------------------------------
let upsellCount = 0;
// eslint-disable-next-line no-unexpected-multiline
(function () {
    // eslint-disable-next-line no-undef
    if (!Shopify.wasPostPurchasePageSeen) {
        onInitialOrder(window.Shopify.order, window.Shopify);

    }
    // eslint-disable-next-line no-undef
    Shopify.on('CheckoutAmended', function (newRawOrder, initialRawOrder) {
        onUpsellOrder(newRawOrder, initialRawOrder, window.Shopify);
    });
})();
// END EVENT HOOKS -------------------------------------------------------

// eslint-disable-next-line no-unused-vars
class Order {
    constructor(rawOrder, rawOrderFormatter, dlEventName, upsellCount, shopifyObject) {
        this._shopifyObject = shopifyObject;
        this._rawOrder = rawOrder;
        this._dlEventName = dlEventName;
        this._isUpsell = upsellCount ? true : false;
        this._upsellCount = upsellCount;
        this._formattedOrderForDL = rawOrderFormatter(rawOrder, dlEventName, this._isUpsell, upsellCount, shopifyObject);
    }

    pushFormattedOrderToDL() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(this._formattedOrderForDL);
    }
}

// Creates a raw order based on diffing an initial order and upsell order
// eslint-disable-next-line no-unused-vars
function createRawOrderFromDiff(initialRawOrder, upsellRawOrder) {
    upsellRawOrder = { ...upsellRawOrder };
    initialRawOrder = { ...initialRawOrder };
    // get the new line items that aren't in the previous order
    const initialOrderItemIds = initialRawOrder.lineItems.map((lineItem) => lineItem.id);
    const upsellOrderLineItems = upsellRawOrder.lineItems.filter((lineItem) => {
        return initialOrderItemIds.indexOf(lineItem.id) < 0;
    })
    const subtotalPrice = getAdditionalSubtotal(upsellRawOrder, initialRawOrder);
    const totalPrice = getAdditionalRevenue(upsellRawOrder, initialRawOrder);
    delete upsellRawOrder['lineItems'];
    delete upsellRawOrder['subtotalPrice'];
    delete upsellRawOrder['totalPrice'];
    // discount field applies to initial order only.
    // delete upsellRawOrder['discounts'];
    const rawOrder = {
        'lineItems': upsellOrderLineItems,
        subtotalPrice,
        totalPrice,
        ...upsellRawOrder,
    }
    return rawOrder;
}

// Takes an order and formats it for the data layer
// eslint-disable-next-line no-unused-vars
function rawOrderFormatter(rawOrder, dlEventName, isUpsell, upsellCount, shopifyObject) {
    const orderFormattedForDL = {
        'event': dlEventName,
        'event_id': getOrderId(rawOrder.id, isUpsell, upsellCount),
        'user_properties': getUserProperties(rawOrder),
        'ecommerce': {
            'purchase': {
                'actionField': getActionField(rawOrder, isUpsell, shopifyObject),
                'products': getLineItems(rawOrder.lineItems),
            },
            'currencyCode': rawOrder.currency,
        },
    }
    return orderFormattedForDL;
}

// Returns a user properties object
function getUserProperties(data) {
    return {
        'customer_id': data.customer.id,
        'customer_email': data.customer.email,
        'customer_first_name': data.customer.firstName,
        'customer_last_name': data.customer.lastName,
    }
}

// Gets line items in purchase
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
            'quantity': item.quantity.toString(),
            // Not available
            // 'brand': orderItem.brand,
        }
    });
}

function getActionField(rawOrder, isUpsell, shopifyObject) {
    try {
        var affiliation = new URL(shopifyObject.pageUrl).hostname;
    } catch (e) {
        affiliation = '';
    }
    return {
        'action': "purchase",
        'affiliation': affiliation,
        // This is the longer order id that shows in the url on an order page
        'id': getOrderId(rawOrder.id, isUpsell, upsellCount).toString(),
        // This should be the #1240 that shows in order page.
        'order_name': getOrderId(rawOrder.number, isUpsell, upsellCount).toString(),
        // This is total discount. Dollar value, not percentage
        // On the first order we can look at the discounts object. On upsells, we can't.
        'discount_amount': getDiscountAmount(rawOrder, isUpsell),
        // We can't determine shipping & tax. For the time being put the difference between subtotal and rev in shipping
        'shipping': (parseFloat(rawOrder.totalPrice) - parseFloat(rawOrder.subtotalPrice)).toString(),
        'tax': '0',
        'revenue': rawOrder.totalPrice,
        'sub_total': rawOrder.subtotalPrice,
    };
}

function getDiscountAmount(shopifyOrder, isUpsell) {
    if (shopifyOrder.discounts === null || typeof shopifyOrder.discounts === 'undefined') return '0';
    if (shopifyOrder.discounts.length === 0) return '0';
    // If this isn't an upsell we can look at the discounts object.
    if (!isUpsell) {
        // Collect all the discounts on the first order.
        return shopifyOrder.discounts.reduce(function (acc, discount) {
            return acc += parseFloat(discount.amount);
        }, 0).toFixed(2).toString();
        // If this an upsell we have to look at the line item discounts
        // The discount block provided only applies to the first order.
    } else {
        return shopifyOrder.lineItems.reduce(function (acc, addedItem) {
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


function onInitialOrder(initialOrder, shopifyObject) {
    const rawOrder = initialOrder;
    const order = new Order(rawOrder, rawOrderFormatter, 'dl_purchase', upsellCount, shopifyObject);
    order.pushFormattedOrderToDL();
}

function onUpsellOrder(newRawOrder, initialRawOrder, shopifyObject) {
    upsellCount++;
    const rawOrder = createRawOrderFromDiff(initialRawOrder, newRawOrder)
    const order = new Order(rawOrder, rawOrderFormatter, 'dl_upsell_purchase', upsellCount, shopifyObject);
    order.pushFormattedOrderToDL();
}

try {
    module.exports = exports = {
        onUpsellOrder,
        onInitialOrder,
        resetUpsellCount: function () { upsellCount = 0; }
    };
    // eslint-disable-next-line no-empty
} catch (e) { }