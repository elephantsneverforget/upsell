import { OCUUpsellOrder, OCUOrder } from "./OCUOrder.js";
// If it's a single function how should the parameters used? Should I pass null?
// Is there a rule of thumb I can use?
function onOrder(initialRawOrder, upsellRawOrder, shopifyObject) {
    const affiliation = getAffiliation(shopifyObject);
    const isUpsell = !!upsellRawOrder;
    if (isUpsell) {
        upsellCount++;
        const args = {
            rawOrder: initialRawOrder,
            upsellRawOrder: upsellRawOrder,
            upsellCount: upsellCount,
            affiliation: affiliation,
            dlEventName: 'dl_upsell_purchase',
        };
        const upsellOrder = new OCUUpsellOrder(args);
        upsellOrder.pushFormattedOrderToDL();
    } else {
        const args = {
            rawOrder: initialRawOrder,
            affiliation: affiliation,
            dlEventName: 'dl_purchase',
        };
        const initialOrder = new OCUOrder(args);
        initialOrder.pushFormattedOrderToDL();
    }
}

// TODO: Is there a better way to do this?
function getAffiliation(shopifyObject) {
    try {
        return new URL(shopifyObject.pageUrl).hostname;
    } catch (e) {
        return "";
    }
}

try {
    // eslint-disable-next-line no-undef
    module.exports = exports = {
        onOrder,
        resetUpsellCount: function () {
            upsellCount = 0;
        },
    };
    // eslint-disable-next-line no-empty
} catch (e) {}

// ************************ EVENT HOOKS *****************************
let upsellCount = 0;
// eslint-disable-next-line no-unexpected-multiline
(function () {
    // eslint-disable-next-line no-undef
    if (Shopify.wasPostPurchasePageSeen) {
        const initialRawOrder = window.Shopify.order;
        onOrder(initialRawOrder, null, window.Shopify);
    }
    // eslint-disable-next-line no-undef
    Shopify.on("CheckoutAmended", function (newRawOrder, initialRawOrder) {
        onOrder(initialRawOrder, newRawOrder, window.Shopify);
    });
})();
// ************************ END EVENT HOOKS *************************

(function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
    });
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-M5VJXQ9");
