// If this page hasn't been seen push a dl_purchase event after the initial sale.
var upsellCount = 0;
(function () {
    // EVENT HOOKS -----------------------------------------------------------
    // eslint-disable-next-line no-undef
    if (!Shopify.wasPostPurchasePageSeen) {
        pushOrder(window.Shopify.order, null, window.Shopify, false);
    }
    // eslint-disable-next-line no-undef
    Shopify.on('CheckoutAmended', function (newOrder, initialOrder) {
        pushOrder(newOrder, initialOrder, window.Shopify, true);
    });
    // END EVENT HOOKS -------------------------------------------------------

    // eslint-disable-next-line no-unused-vars
    function pushOrder(initialRawOrder, newRawUpsellOrder, shopifyObject, isUpsell) {
        // If multiple order
        const rawOrder = isUpsell ? createRawOrderFromDiff(initialRawOrder, newRawUpsellOrder) : initialRawOrder;
        const eventName = isUpsell ? 'dl_upsell_purchase' : 'dl_purchase';
        const order = new Order(rawOrder, rawOrderFormatter, eventName);
        order.pushFormattedOrderToDL();
    }

    // Creates a raw order based on diffing an initial order and upsell order
    // eslint-disable-next-line no-unused-vars
    function createRawOrderFromDiff(initialRawOrder, subsequentRawOrder) {
        return;
    }

    // Takes an order and formats it for the data layer
    // eslint-disable-next-line no-unused-vars
    function rawOrderFormatter() {
        return;
    }

    // UTILS -----------------------------------------------------------------
    // Function called after original order is placed, pre upsell.
    function onCheckout(initialOrder, shopifyObject) {
        window.dataLayer = window.dataLayer || [];
        pushDLPurchase(initialOrder, initialOrder.lineItems, false, null, shopifyObject);
    }

    // Function called when upsell is taken. Seperate the new/upsell
    // items from the items in the initial order and then send a purchase event
    // for just the new items.
    function onCheckoutAmended(upsellOrder, initialOrder, shopifyObject) {
        // identify which items were added to the initial order, if any.
        upsellCount++;
        // The line item id is unique for order items, even if the items contained are the same.
        // We can use this to seperate out items from the initial order from the upsell.
        var initialItemIds = initialOrder.lineItems.map(function (line) { return line.id; });
        var addedItems = upsellOrder.lineItems.filter(
            function (line) { return initialItemIds.indexOf(line.id) < 0; }
        );
        // if no new items were added skip tracking
        if (addedItems.length === 0) return;
        pushDLPurchase(upsellOrder, addedItems, true, initialOrder, shopifyObject);
    }

    function pushDLPurchase(order, addedItems, isUpsell, initialOrder, shopifyObject) {
        window.dataLayer.push({
            'event': isUpsell ? 'dl_upsell_purchase' : 'dl_purchase',
            'event_id': getOrderId(order.id, isUpsell),
            'user_properties': getUserProperties(order),
            'ecommerce': {
                'purchase': {
                    'actionField': getActionField(order, isUpsell, initialOrder, addedItems, shopifyObject),
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

    function getActionField(order, isUpsell, initialOrder, addedItems, shopifyObject) {
        var revenue = isUpsell ? getAdditionalRevenue(order, initialOrder) : order.totalPrice;
        var subtotal = isUpsell ? getAdditionalSubtotal(order, initialOrder) : order.subtotalPrice;
        try {
            var affiliation = new URL(shopifyObject.pageUrl).hostname;
        } catch (e) {
            // eslint-disable-next-line no-redeclare
            var affiliation = '';
        }
        return {
            'action': "purchase",
            'affiliation': affiliation,
            // This is the longer order id that shows in the url on an order page
            'id': getOrderId(order.id, isUpsell).toString(),
            // This should be the #1240 that shows in order page.
            'order_name': getOrderId(order.number, isUpsell).toString(),
            // This is total discount. Dollar value, not percentage
            // On the first order we can look at the discounts object. On upsells, we can't.
            // This needs to be a string.
            'discount_amount': getDiscountAmount(order, isUpsell, addedItems),
            // We can't determine shipping & tax. For the time being put the difference between subtotal and rev in shipping
            'shipping': (parseFloat(revenue) - parseFloat(subtotal)).toString(),
            'tax': '0',
            'revenue': revenue,
            'sub_total': subtotal,
        };
    }

    function getDiscountAmount(shopifyOrder, isUpsell, addedItems) {
        if (shopifyOrder.discounts === null || typeof shopifyOrder.discounts === 'undefined') return '0';
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
        return isUpsell ? orderId.toString() + '-US' + upsellCount.toString() : orderId;
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
            resetUpsellCount: function () { upsellCount = 0; },
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
})();