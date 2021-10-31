// If this page hasn't been seen, send the initial order to the parent iFrame
upsellCount = 0;
debugger;
if (Shopify.wasPostPurchasePageSeen) {
    console.log("onCheckout event");
    onCheckout(window.Shopify.order);
}
// If an upsell order is taken, send a message to the parent iframe with both the new and original order
Shopify.on('CheckoutAmended', function (newOrder, initialOrder) {
    // TODO: What happens on second upsell? Does initial Order contain the first upsell?
    onCheckoutAmended(newOrder, initialOrder);
});

function onCheckout(initialOrder) {
    window.dataLayer = window.dataLayer || [];
    pushDLPurchase(initialOrder, getLineItems(initialOrder.lineItems), false)
}

// Function called when upsell is taken. Seperate the new/upsell
// items from the items in the initial order and then send a purchase event
// for just the new items.
function onCheckoutAmended(upsellOrder, initialOrder) {
    // identify which items were added to the initial order, if any.
    debugger;
    upsellCount++;
    var initialItems = initialOrder.lineItems.map(function (line) { return line.id; });
    var addedItems = upsellOrder.lineItems.filter(
        function (line) { return initialItems.indexOf(line.id) < 0; }
    );
    // if no new items were added skip tracking
    if (addedItems.length === 0) return;
    pushDLPurchase(upsellOrder, getLineItems(addedItems), true, initialOrder);
}

function pushDLPurchase(order, lineItems, isUpsell, initialOrder) {
    window.dataLayer.push({
        'event': 'dl_purchase',
        'event_id': getOrderId(order.id, isUpsell),
        'user_properties': getUserProperties(order),
        'ecommerce': {
            'purchase': {
                'actionField': getActionField(order, isUpsell, initialOrder),
                'products': lineItems
            },
            'currencyCode': order.currency,
        },
    });
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
            'variant_id': item.variant.id,
            'product_id': Number(item.id).toString(),
            // TODO: ID is sku?
            'id': item.variant.sku,
            // TODO: What is this? Check these ids are correct.
            'variant': item.variant.sku.toString(),
            'name': item.title,
            'price': item.price,
            'quantity': item.quantity,
            // TODO: none of these are available
            // 'brand': orderItem.brand,
        }
    });
}

function getActionField(shopifyOrder, isUpsell, initialOrder) {
    return {
        'action': "purchase",
        // TODO: No org available
        // 'affiliation': data.organization,
        // TODO: Should this be order id or order number?
        'id': getOrderId(shopifyOrder.id, isUpsell),
        // TODO: What should this be? Assuming this should be the #1240 that shows in order page.
        'order_name': getOrderId(shopifyOrder.number, isUpsell),
        'discount_amount': shopifyOrder.discounts.length > 0 ? getDiscountAmount(shopifyOrder) : 0,
        // We can't determine shipping & tax.
        // Revenue - subtotal == shipping + tax.
        'revenue': isUpsell ? (parseFloat(shopifyOrder.totalPrice) - parseFloat(initialOrder.totalPrice)).toFixed(2) : shopifyOrder.totalPrice, // if upsell revenue of this order minus revenue of last
        'sub_total': isUpsell ? (parseFloat(shopifyOrder.subtotalPrice) - parseFloat(initialOrder.subtotalPrice)).toFixed(2) : shopifyOrder.subtotalPrice,
    };
}

function getDiscountAmount(shopifyOrder) {
    return shopifyOrder.discounts.reduce(function (acc, discount) {
        return acc += parseFloat(discount.amount);
    }, 0)
}

function getOrderId(orderId, isUpsell) {
    return isUpsell ? orderId.toString() + '-' + upsellCount.toString() : orderId;
}

function test(){
    onCheckoutAmended(newOrder, initialOrder);
}

try {
    module.exports = exports = {
        onCheckoutAmended: onCheckoutAmended,
        onCheckout: onCheckout,
    };
} catch (e) { }

// Inlcude GTM
(function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({
        'gtm.start':
            new Date().getTime(), event: 'gtm.js'
    }); var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-M5VJXQ9');