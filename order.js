// EVENT HOOKS -----------------------------------------------------------
let upsellCount = 0;
// eslint-disable-next-line no-unexpected-multiline
(function () {
    // eslint-disable-next-line no-undef
    if (Shopify.wasPostPurchasePageSeen) {
        const initialRawOrder = window.Shopify.order;
        onOrder(initialRawOrder, null, window.Shopify)
    }
    // eslint-disable-next-line no-undef
    Shopify.on('CheckoutAmended', function (newRawOrder, initialRawOrder) {
        onOrder(initialRawOrder, newRawOrder, window.Shopify)
    });
})();
// END EVENT HOOKS -------------------------------------------------------

// eslint-disable-next-line no-unused-vars
class Order {
    constructor() { }

    rawOrderFormatter() {
        throw new Error('Must subclass rawOrderFormatter with implementation.');
    }

    pushFormattedOrderToDL() {
        window.dataLayer.push(this.formattedOrder);
    }
}

class OCUOrder extends Order {
    constructor(rawOrder, dlEventName, affiliation) {
        super();
        this.isUpsell = false;
        this.upsellCount = null;
        this.rawOrder = rawOrder;
        this.orderId = rawOrder.id;
        this.formattedOrder = this.rawOrderFormatter(rawOrder, dlEventName, affiliation);

    }

    // Takes an order and formats it for the data layer
    rawOrderFormatter(rawOrder, dlEventName, affiliation) {
        const orderFormattedForDL = {
            'event': dlEventName,
            'event_id': this.getOrderId(),
            'user_properties': getUserProperties(rawOrder),
            'ecommerce': {
                'purchase': {
                    'actionField': getActionField(rawOrder, this.isUpsell, affiliation),
                    'products': getLineItems(rawOrder.lineItems),
                },
                'currencyCode': rawOrder.currency,
            },
        }
        return orderFormattedForDL;
    }

    getOrderId() {
        return this.isUpsell ? this.orderId.toString() + '-US' + this.upsellCount.toString() : this.orderId;
    }
}


class OCUUpsellOrder extends OCUOrder {
    constructor(initialRawOrder, upsellRawOrder, upsellCount, dlEventName, affiliation) {
        super();
        this.rawOrder = this.createRawOrderFromDiff(initialRawOrder, upsellRawOrder);
        this.formattedOrder = this.rawOrderFormatter(this.rawOrder, dlEventName, affiliation)
        this.upsellCount = upsellCount;
        this.dlEventName = dlEventName;
        this.isUpsell = true;
    }

    // Creates a raw order based on diffing an initial order and upsell order
    createRawOrderFromDiff(initialRawOrder, upsellRawOrder) {
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

function getActionField(rawOrder, isUpsell, affiliation) {
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

// Main flow should be at top of bottom of file. Main script is usually invoked at bottom. BEt
// infer upsell 
// ad isUpsell to class it's being passed around everything


// How do I make a decision on a function like this? Should it be 2 functions?
// If it's a single function how should the parameters used? Should I pass null?
// Is there a rule of thumb I can use?
function onOrder(initialRawOrder, upsellRawOrder, shopifyObject) {
    const affiliation = getAffiliation(shopifyObject);
    const isUpsell = !!upsellRawOrder;
    if (isUpsell) {
        upsellCount++;
        const upsellOrder = OCUUpsellOrder(initialRawOrder, upsellRawOrder, upsellCount, 'dl_upsell_purchase', affiliation);
        upsellOrder.pushFormattedOrderToDL();
    } else {
        const initialOrder = new OCUOrder(initialRawOrder, null, 'dl_purchase', affiliation);
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

function getOrderId(orderId, isUpsell, upsellCount) {
    return isUpsell ? this.orderId.toString() + '-US' + upsellCount.toString() : orderId;
}

function getAdditionalRevenue(newOrder, initialOrder) {
    return (parseFloat(newOrder.totalPrice) - parseFloat(initialOrder.totalPrice)).toFixed(2);
}

function getAdditionalSubtotal(newOrder, initialOrder) {
    return (parseFloat(newOrder.subtotalPrice) - parseFloat(initialOrder.subtotalPrice)).toFixed(2);
}

try {
    module.exports = exports = {
        onOrder,
        resetUpsellCount: function () { upsellCount = 0; },
        Order,
        OCUUpsellOrder,
        OCUOrder,
    };
    // eslint-disable-next-line no-empty
} catch (e) { }

const initialOrder_1 = require('./sample_objects/sampleOrderSequenceWithTax/initialOrder.js')
const shopifyObject = require('./sample_objects/shopifyObjectOnUpsellPages.js');
const affiliation = getAffiliation(shopifyObject);
const initialOrder = new OCUOrder(initialOrder_1, null, 'dl_purchase', affiliation);
initialOrder.pushFormattedOrderToDL();