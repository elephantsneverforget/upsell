// If this page hasn't been seen push a dl_purchase event after the initial sale.
upsellCount = 0;
if (Shopify.wasPostPurchasePageSeen) {
    console.log("onCheckout event");
    onCheckout(window.Shopify.order);
}

Shopify.on('CheckoutAmended', function (newOrder, initialOrder) {
    onCheckoutAmended(newOrder, initialOrder);
});

// Function called after original order is placed, pre upsell.
function onCheckout(initialOrder) {
    window.dataLayer = window.dataLayer || [];
    pushDLPurchase(initialOrder, initialOrder.lineItems, false);
}

// Function called when upsell is taken. Seperate the new/upsell
// items from the items in the initial order and then send a purchase event
// for just the new items.
function onCheckoutAmended(upsellOrder, initialOrder) {
    // identify which items were added to the initial order, if any.
    upsellCount++;
    var initialItems = initialOrder.lineItems.map(function (line) { return line.id; });
    var addedItems = upsellOrder.lineItems.filter(
        function (line) { return initialItems.indexOf(line.id) < 0; }
    );
    // if no new items were added skip tracking
    if (addedItems.length === 0) return;
    pushDLPurchase(upsellOrder, addedItems, true, initialOrder);
}

function pushDLPurchase(order, addedItems, isUpsell, initialOrder) {
    window.dataLayer.push({
        'event': 'dl_purchase',
        'event_id': getOrderId(order.id, isUpsell),
        'user_properties': getUserProperties(order),
        'ecommerce': {
            'purchase': {
                'actionField': getActionField(order, isUpsell, initialOrder, addedItems),
                'products': getLineItems(addedItems),
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

function getActionField(shopifyOrder, isUpsell, initialOrder, addedItems) {
    return {
        'action': "purchase",
        // TODO: No org available
        // 'affiliation': data.organization,
        // TODO: Should this be order id or order number?
        'id': getOrderId(shopifyOrder.id, isUpsell),
        // TODO: What should this be? Assuming this should be the #1240 that shows in order page.
        'order_name': getOrderId(shopifyOrder.number, isUpsell),
        // This is total discount. Dollar value, not percentage
        // On the first order we can look at the discounts object. On upsells, we can't.
        // This needs to be a string.
        'discount_amount': getDiscountAmount(shopifyOrder, isUpsell, addedItems),
        // We can't determine shipping & tax.
        // Revenue - subtotal == shipping + tax.
        'revenue': isUpsell ? getAdditionalRevenue(shopifyOrder, initialOrder) : shopifyOrder.totalPrice, // if upsell revenue of this order minus revenue of last
        'sub_total': isUpsell ? getAdditionalSubtotal(shopifyOrder, initialOrder) : shopifyOrder.subtotalPrice,
    };
}

function getDiscountAmount(shopifyOrder, isUpsell, addedItems) {
    if (shopifyOrder.discounts.length === 0) return '0';
    // If this isn't an upsell we can look at the discounts object.
    if (!isUpsell) {
        // Collect all the discounts on the first order.
        return shopifyOrder.discounts.reduce(function (acc, discount) {
            return acc += parseFloat(discount.amount);
        }, 0).toFixed(2).toString();
    // If this an upsell we have to look at the line item discounts
    // The discount block provided doesn't only applies to the first order.
    } else {
        return addedItems[0].lineLevelTotalDiscount;
    }

}

function getOrderId(orderId, isUpsell) {
    return isUpsell ? orderId.toString() + '-' + upsellCount.toString() : orderId;
}


function getAdditionalRevenue(newOrder, initialOrder) {
    return (parseFloat(newOrder.totalPrice) - parseFloat(initialOrder.totalPrice)).toFixed(2);
}

function getAdditionalSubtotal(newOrder, initialOrder) {
    return (parseFloat(newOrder.subtotalPrice) - parseFloat(initialOrder.subtotalPrice)).toFixed(2);
}

function test() {
    onCheckoutAmended(newOrder, initialOrder);
}

try {
    module.exports = exports = {
        onCheckoutAmended: onCheckoutAmended,
        onCheckout: onCheckout,
    };
} catch (e) { }

(function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({
        'gtm.start':
            new Date().getTime(), event: 'gtm.js'
    }); var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-M5VJXQ9');