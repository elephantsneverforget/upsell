import { Order } from "./Order.js";
export class OCUOrder extends Order {
    // Takes an order and formats it for the data layer
    rawOrderFormatter(rawOrder) {
        const orderFormattedForDL = {
            event: this.dlEventName,
            event_id: this.getOrderId(rawOrder.id),
            user_properties: this.getUserProperties(),
            ecommerce: {
                purchase: {
                    actionField: this.getActionField(),
                    products: this.getLineItems(),
                },
                currencyCode: rawOrder.currency,
            },
        };
        return orderFormattedForDL;
    }

    getOrderId(orderId) {
        return orderId.toString();
    }

    // Returns a user properties object
    getUserProperties() {
        return {
            customer_id: this.rawOrder.customer.id,
            customer_email: this.rawOrder.customer.email,
            customer_first_name: this.rawOrder.customer.firstName,
            customer_last_name: this.rawOrder.customer.lastName,
        };
    }

    getDiscountAmount() {
        if (
            this.rawOrder.discounts === null ||
            typeof this.rawOrder.discounts === "undefined"
        )
            return "0";
        if (this.rawOrder.discounts.length === 0) return "0";
        return this.rawOrder.discounts
            .reduce(function (acc, discount) {
                return (acc += parseFloat(discount.amount));
            }, 0)
            .toFixed(2)
            .toString();
    }

    getActionField() {
        return {
            action: "purchase",
            affiliation: this.affiliation,
            // This is the longer order id that shows in the url on an order page
            id: this.getOrderId(this.rawOrder.id),
            // This should be the #1240 that shows in order page.
            order_name: this.getOrderId(this.rawOrder.number),
            // This is total discount. Dollar value, not percentage
            // On the first order we can look at the discounts object. On upsells, we can't.
            discount_amount: this.getDiscountAmount(),
            // We can't determine shipping & tax. For the time being put the difference between subtotal and rev in shipping
            shipping: (
                parseFloat(this.rawOrder.totalPrice) -
                parseFloat(this.rawOrder.subtotalPrice)
            ).toString(),
            tax: "0",
            revenue: this.rawOrder.totalPrice,
            sub_total: this.rawOrder.subtotalPrice,
        };
    }

    // Gets line items in purchase
    getLineItems() {
        return this.rawOrder.lineItems.map(function (item) {
            return {
                category: item.product.type,
                variant_id: item.variant.id.toString(),
                product_id: Number(item.id).toString(),
                id: item.variant.sku,
                // We don't get variant title details
                variant: item.title,
                name: item.title,
                price: item.price.toString(),
                quantity: item.quantity.toString(),
                // Not available
                // 'brand': orderItem.brand,
            };
        });
    }
}

export class OCUInitialOrder extends OCUOrder {
    constructor(initialRawOrder, affiliation) {
        super(initialRawOrder, 'dl_purchase', affiliation);
    }
}

export class OCUUpsellOrder extends OCUOrder {
    constructor(initialRawOrder, upsellRawOrder, upsellCount, affiliation) {
        const rawOrder = OCUUpsellOrder.createRawOrderFromDiff(
            initialRawOrder,
            upsellRawOrder
        );
        super(rawOrder, "dl_upsell_purchase", affiliation);
        this.upsellCount = upsellCount;
    }

    // Creates a raw order based on diffing an initial order and upsell order
    static createRawOrderFromDiff(initialRawOrder, upsellRawOrder) {
        upsellRawOrder = { ...upsellRawOrder };
        initialRawOrder = { ...initialRawOrder };
        // get the new line items that aren't in the previous order
        const initialOrderItemIds = initialRawOrder.lineItems.map(
            (lineItem) => lineItem.id
        );
        const upsellOrderLineItems = upsellRawOrder.lineItems.filter(
            (lineItem) => {
                return initialOrderItemIds.indexOf(lineItem.id) < 0;
            }
        );
        const subtotalPrice = OCUUpsellOrder.getAdditionalSubtotal(
            upsellRawOrder,
            initialRawOrder
        );
        const totalPrice = OCUUpsellOrder.getAdditionalRevenue(
            upsellRawOrder,
            initialRawOrder
        );
        delete upsellRawOrder["lineItems"];
        delete upsellRawOrder["subtotalPrice"];
        delete upsellRawOrder["totalPrice"];
        // discount field applies to initial order only.
        // delete upsellRawOrder['discounts'];
        const rawOrder = {
            lineItems: upsellOrderLineItems,
            subtotalPrice,
            totalPrice,
            ...upsellRawOrder,
        };
        return rawOrder;
    }

    getDiscountAmount() {
        if (
            this.rawOrder.discounts === null ||
            typeof this.rawOrder.discounts === "undefined"
        )
            return "0";
        return this.rawOrder.lineItems
            .reduce(function (acc, addedItem) {
                return (acc += parseFloat(addedItem.lineLevelTotalDiscount));
            }, 0)
            .toFixed(2)
            .toString();
    }

    static getAdditionalRevenue(newOrder, initialOrder) {
        return (
            parseFloat(newOrder.totalPrice) -
            parseFloat(initialOrder.totalPrice)
        ).toFixed(2);
    }

    static getAdditionalSubtotal(newOrder, initialOrder) {
        return (
            parseFloat(newOrder.subtotalPrice) -
            parseFloat(initialOrder.subtotalPrice)
        ).toFixed(2);
    }

    getOrderId(orderId) {
        return orderId.toString() + "-US" + this.upsellCount.toString();
    }
}
