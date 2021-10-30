// <script>
(function () {
    window.dataLayer = window.dataLayer || [];
    // Track the initial conversion as we would normally do on the order status page
    // Make sure this page hasn't been reloaded or revisited so we don't
    // This always evaluates to true!
    // if (Shopify.wasPostPurchasePageSeen) {
    console.log("Logging onCheckout");
    // setInterval(function () {
    //     window.top.postMessage({ command: 'onCheckout', type: 'postPurchase' }, '*');
    // }, 5000);

    setTimeout(function () {
        window.top.postMessage({ command: 'onCheckout', newOrder: window.Shopify.order }, '*');
    }, 5000);
    // onCheckout(window.Shopify.order)

    // }

    // Set up additional conversion tracking for upsell orders
    Shopify.on('CheckoutAmended', function (newOrder, previousOrder) {
        console.log("Logging onCheckoutAmended");
        window.top.postMessage({ command: 'onCheckoutAmended', newOrder: newOrder, previousOrder: previousOrder }, '*')
        // onCheckoutAmended(newOrder, previousOrder);
    });
})();



// This function gets called when the purchase is made, and the upsell is shown.
// This sends the first part of the order, much like we'd normally do on the order
// status page
function onCheckout(initialOrder) {
    window.dataLayer.push({
        'event': 'dl_purchase',
        'event_id': initialOrder.id,
        'user_properties': getUserProperties(initialOrder),
        'ecommerce': {
            'purchase': {
                'actionField': getActionField(initialOrder),
                'products': getLineItems(initialOrder.lineItems)
            },
            'currencyCode': initialOrder.currency,
        },
    });
}

// Function called when upsell is taken. The idea is to seperate the new/upsell
// items from the items in the initial order and then send a purchase event
// for just the new items.
function onCheckoutAmended(upsellOrder, initialOrder) {
    // identify which items were recently added, if any
    var oldItems = initialOrder.lineItems.map(function (line) { return line.id; });
    var addedItems = upsellOrder.lineItems.filter(
        function (line) { return oldItems.indexOf(line.id) < 0; }
    );
    // no new items were added, so we skip conversion tracking
    if (addedItems.length === 0) return;

    window.dataLayer.push({
        'event': 'dl_purchase',
        'event_id': upsellOrder.id,
        'user_properties': getUserProperties(upsellOrder),
        'ecommerce': {
            'purchase': {
                'actionField': getActionField(upsellOrder),
                'products': getLineItems(addedItems)
            },
            'currencyCode': upsellOrder.currency,
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
        // TODO: None of this is available. No idea why. Call the API?
        // 'customer_phone': data.order.customer.phone,
        // 'customer_city': data.order.destination.city,
        // 'customer_zip': data.order.destination.postal,
        // 'customer_address_1': data.order.destination.streets[0],
        // 'customer_address_2': data.order.destination.streets[1],
        // 'customer_country': data.order.destination.country,
        // 'customer_province': data.order.destination.province,
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
            // 'image': contentItem.images[0]['url'],
        }
    });
}

function getActionField(shopifyOrder) {
    return {
        'action': "purchase",
        // TODO: No org available
        // 'affiliation': data.organization,
        // TODO: Should this be order id or order number?
        'id': shopifyOrder.id,
        // TODO: What should this be?
        'order_name': shopifyOrder.id,
        'discount_amount': shopifyOrder.discounts.length > 0 ? getDiscountAmount(shopifyOrder) : 0,
        'revenue': shopifyOrder.totalPrice,
        'sub_total': shopifyOrder.subtotalPrice,
        // TODO: No tax amount given
        // 'tax': getValue('vat', data) + getValue('duty', data),
        // TODO: No shipping amount given
        // 'shipping': getValue('shipping', data),
    };
}

function getDiscountAmount(shopifyOrder) {
    return shopifyOrder.discounts.reduce(function (acc, discount) {
        return acc += parseFloat(discount.amount);
    }, 0)
}

try {
    module.exports = exports = {
        onCheckoutAmended: onCheckoutAmended,
        onCheckout: onCheckout,
    };
} catch (e) { }
// </script>

// <script>
// (function (w, d, s, l, i) {
//     w[l] = w[l] || []; w[l].push({
//         'gtm.start':
//             new Date().getTime(), event: 'gtm.js'
//     }); var f = d.getElementsByTagName(s)[0],
//         j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
//             'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
// })(window, document, 'script', 'dataLayer', 'GTM-M5VJXQ9');
// </script>