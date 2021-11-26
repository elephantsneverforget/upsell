// TODO: How do you prevent instantiation of a base class in JS?
export class Order {
    constructor() { }

    rawOrderFormatter() {
        throw new Error('Must subclass rawOrderFormatter with implementation.');
    }

    pushFormattedOrderToDL() {
        window.dataLayer.push(this.formattedOrder);
    }
}
