import { OCUUpsellOrder, OCUInitialOrder } from './order';

// ad isUpsell to class it's being passed around everything
// How do I make a decision on a function like this? Should it be 2 functions?
// If it's a single function how should the parameters used? Should I pass null?
// Is there a rule of thumb I can use?
function onOrder(initialRawOrder, upsellRawOrder, shopifyObject) {
    const affiliation = getAffiliation(shopifyObject);
    const isUpsell = !!upsellRawOrder;
    if (isUpsell) {
        upsellCount++;
        const upsellOrder = new OCUUpsellOrder(initialRawOrder, upsellRawOrder, upsellCount, affiliation);
        upsellOrder.pushFormattedOrderToDL();
    } else {
        const initialOrder = new OCUInitialOrder(initialRawOrder, affiliation);
        initialOrder.pushFormattedOrderToDL();
    }
}

// TODO: Is there a better way to do this?
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
    };
    // eslint-disable-next-line no-empty
} catch (e) { }

// ************************ EVENT HOOKS ***************************** 
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
// ************************ END EVENT HOOKS *************************

(function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({
        'gtm.start':
            new Date().getTime(), event: 'gtm.js'
    }); var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-M5VJXQ9');