// TODO: How do you prevent instantiation of a base class in JS?
export class Order {
    constructor(rawOrder, dlEventName, affiliation) { 
        // Object.assign(this, conts);
        this.rawOrder = rawOrder;
        this.dlEventName = dlEventName;
        this.affiliation = affiliation;
    }

    rawOrderFormatter() {
        throw new Error('Must subclass rawOrderFormatter with implementation.');
    }

    pushFormattedOrderToDL() {
        const rawOrder = this.rawOrderFormatter(this.rawOrder);
        window.dataLayer.push(rawOrder);
    }
}
