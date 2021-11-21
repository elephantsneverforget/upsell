// EVENT HOOKS -----------------------------------------------------------
let upsellCount = 0;
// eslint-disable-next-line no-unexpected-multiline
// (function () {
//     // eslint-disable-next-line no-undef
//     if (Shopify.wasPostPurchasePageSeen) {
//         const initialRawOrder = window.Shopify.order;
//         onOrder(initialRawOrder, null, window.Shopify)
//     }
//     // eslint-disable-next-line no-undef
//     Shopify.on('CheckoutAmended', function (newRawOrder, initialRawOrder) {
//         onOrder(initialRawOrder, newRawOrder, window.Shopify)
//     });
// })();
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
    constructor(dlEventName, affiliation) {
        super();
        this.dlEventName = dlEventName;
        this.affiliation = affiliation;
    }

    generateFormattedOrder(rawOrder) {
        this.rawOrder = rawOrder;
        this.formattedOrder = this.rawOrderFormatter(rawOrder, this.dlEventName)
    }

    // Takes an order and formats it for the data layer
    rawOrderFormatter(rawOrder, dlEventName) {
        const orderFormattedForDL = {
            'event': dlEventName,
            'event_id': this.getOrderId(rawOrder.id),
            'user_properties': this.getUserProperties(),
            'ecommerce': {
                'purchase': {
                    'actionField': this.getActionField(),
                    'products': this.getLineItems(),
                },
                'currencyCode': rawOrder.currency,
            },
        }
        return orderFormattedForDL;
    }

    getOrderId(orderId) {
        return orderId.toString();
    }

    // Returns a user properties object
    getUserProperties() {
        return {
            'customer_id': this.rawOrder.customer.id,
            'customer_email': this.rawOrder.customer.email,
            'customer_first_name': this.rawOrder.customer.firstName,
            'customer_last_name': this.rawOrder.customer.lastName,
        }
    }

    getDiscountAmount() {
        if (this.rawOrder.discounts === null || typeof this.rawOrder.discounts === 'undefined') return '0';
        if (this.rawOrder.discounts.length === 0) return '0';
        return this.rawOrder.discounts.reduce(function (acc, discount) {
            return acc += parseFloat(discount.amount);
        }, 0).toFixed(2).toString();
    }

    getActionField() {
        return {
            'action': "purchase",
            'affiliation': this.affiliation,
            // This is the longer order id that shows in the url on an order page
            'id': this.getOrderId(this.rawOrder.id),
            // This should be the #1240 that shows in order page.
            'order_name': this.getOrderId(this.rawOrder.number),
            // This is total discount. Dollar value, not percentage
            // On the first order we can look at the discounts object. On upsells, we can't.
            'discount_amount': this.getDiscountAmount(),
            // We can't determine shipping & tax. For the time being put the difference between subtotal and rev in shipping
            'shipping': (parseFloat(this.rawOrder.totalPrice) - parseFloat(this.rawOrder.subtotalPrice)).toString(),
            'tax': '0',
            'revenue': this.rawOrder.totalPrice,
            'sub_total': this.rawOrder.subtotalPrice,
        };
    }

    // Gets line items in purchase
    getLineItems() {
        return this.rawOrder.lineItems.map(function (item) {
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
}

class OCUInitialOrder extends OCUOrder {
    constructor(initialRawOrder, affiliation) {
        super('dl_purchase', affiliation);
        super.generateFormattedOrder(initialRawOrder);
    }
}

class OCUUpsellOrder extends OCUOrder {
    constructor(initialRawOrder, upsellRawOrder, upsellCount, affiliation) {
        super('dl_upsell_purchase', affiliation);
        this.upsellCount = upsellCount;
        const rawOrder = this.createRawOrderFromDiff(initialRawOrder, upsellRawOrder);
        super.generateFormattedOrder(rawOrder);
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
        const subtotalPrice = this.getAdditionalSubtotal(upsellRawOrder, initialRawOrder);
        const totalPrice = this.getAdditionalRevenue(upsellRawOrder, initialRawOrder);
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

    getDiscountAmount() {
        if (this.rawOrder.discounts === null || typeof this.rawOrder.discounts === 'undefined') return '0';
        return this.rawOrder.lineItems.reduce(function (acc, addedItem) {
            return acc += parseFloat(addedItem.lineLevelTotalDiscount);
        }, 0).toFixed(2).toString();

    }
    
    getAdditionalRevenue(newOrder, initialOrder) {
        return (parseFloat(newOrder.totalPrice) - parseFloat(initialOrder.totalPrice)).toFixed(2);
    }
    
    getAdditionalSubtotal(newOrder, initialOrder) {
        return (parseFloat(newOrder.subtotalPrice) - parseFloat(initialOrder.subtotalPrice)).toFixed(2);
    }

    getOrderId(orderId) {
        return orderId.toString() + '-US' + this.upsellCount.toString();
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
        const upsellOrder = new OCUUpsellOrder(initialRawOrder, upsellRawOrder, upsellCount, affiliation);
        upsellOrder.pushFormattedOrderToDL();
        upsellCount++;
    } else {
        const initialOrder = new OCUInitialOrder(initialRawOrder, affiliation);
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
        onOrder,
        resetUpsellCount: function () { upsellCount = 0; },
        Order,
        OCUUpsellOrder,
        OCUInitialOrder,
    };
    // eslint-disable-next-line no-empty
} catch (e) { }

// const initialOrder_1 = require('./sample_objects/sampleOrderSequenceWithTax/initialOrder.js')
// const firstUpsell_1 = require('./sample_objects/sampleOrderSequenceWithTax/firstUpsell.js')
// const shopifyObject = require('./sample_objects/shopifyObjectOnUpsellPages.js');
// const affiliation = getAffiliation(shopifyObject);
// const initialOrder = new OCUInitialOrder(initialOrder_1, affiliation);
// initialOrder.pushFormattedOrderToDL();
// const upsellOrder = new OCUUpsellOrder(initialOrder_1, firstUpsell_1, 1, affiliation);
// upsellOrder.pushFormattedOrderToDL();