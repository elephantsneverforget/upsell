// This is the Shopify order object that is passed as soon as you land on the post purchase page
// This is what we'll need to use to fill out our initial dl_purchase.
module.exports = {
    "id": 4099634004004,
    "number": 1294,
    "checkoutToken": "00f7e3639288db19e9f6c34955db037c",
    "lineItems": [
        {
            "id": 10399460425764,
            "finalLinePrice": "19.50",
            "finalPrice": "19.50",
            "lineLevelTotalDiscount": 0,
            "optionsWithValues": [
                {
                    "name": "Title",
                    "value": "Default Title"
                }
            ],
            "originalLinePrice": "19.50",
            "originalPrice": "19.50",
            "price": "19.50",
            "product": {
                "id": 6788257415204,
                "type": ""
            },
            "properties": [],
            "quantity": 1,
            "title": "Trucker Cap",
            "variant": {
                "id": 39657149366308,
                "sku": "4563504_8746"
            }
        }
    ],
    "subtotalPrice": "1.95",
    "totalPrice": "8.24",
    "currency": "USD",
    "discounts": [
        {
            "type": "PercentageDiscount",
            "code": "90OFF",
            "amount": "17.55"
        }
    ],
    "customer": {
        "id": 5402803863588,
        "email": "jonathan@getelevar.com",
        "acceptsMarketing": false,
        "hasAccount": false,
        "firstName": "Jonathan",
        "lastName": "Cairo",
        "ordersCount": 6,
        "totalSpent": "114.15"
    }
}