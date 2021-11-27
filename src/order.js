// TODO: How do you prevent instantiation of a base class in JS?
export class Order {
    constructor(conts) {
        Object.assign(this, conts);
    }

    rawOrderFormatter() {
        throw new Error("Must subclass rawOrderFormatter with implementation.");
    }

    pushFormattedOrderToDL() {
        const formattedOrder = this.rawOrderFormatter(this.rawOrder);
        window.dataLayer.push(formattedOrder);
    }
}
