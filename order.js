// eslint-disable-next-line no-unused-vars
class Order {
    constructor(rawOrder, rawOrderFormatter, dlEventName) {
        this._rawOrder = rawOrder;
        this._formattedOrder = rawOrderFormatter(rawOrder, dlEventName);
    }

    pushFormattedOrderToDL() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(this.order);
    }
}

// Creates a raw order based on diffing an initial order and upsell order
// eslint-disable-next-line no-unused-vars
function createRawOrderFromDiff(initialRawOrder, subsequentRawOrder) {
    return;
}

// Takes an order and formats it for the data layer
// eslint-disable-next-line no-unused-vars
function rawOrderFormatter(rawOrder, dlEventName) {
    return;
}

// If multiple order
const initialRawOrder = require('./sample_objects/sampleOrderSequenceWithMultipleItemsInInitialOrder/initialOrder');
const subsequentRawOrder = require('./sample_objects/sampleOrderSequenceWithMultipleItemsInInitialOrder/firstUpsell');
const rawOrder = isUpsell ? createRawOrderFromDiff(initialRawOrder, subsequentRawOrder) : initialRawOrder;
const order = new Order(rawOrder, rawOrderFormatter, 'dl_purchase');
order.pushFormattedOrderToDL();

module.exports = {
    rawOrderFormatter,
    createRawOrderFromDiff,
    Order,
}