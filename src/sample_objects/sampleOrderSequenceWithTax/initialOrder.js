// $5.00 price - 90% discount (price is .50) + shipping ($1.00) + tax (.08) = $1.58 total rev
export const initialOrder_1 = {
    "id": 4109127254052,
    "number": 1330,
    "checkoutToken": "62297e86957b48769b836c34ecba28b8",
    "lineItems": [
        {
            "id": 10418680365092,
            "finalLinePrice": "5.00",
            "finalPrice": "5.00",
            "lineLevelTotalDiscount": 0,
            "optionsWithValues": [
                {
                    "name": "Size",
                    "value": "Small"
                }
            ],
            "originalLinePrice": "5.00",
            "originalPrice": "5.00",
            "price": "5.00",
            "product": {
                "id": 6791661453348,
                "type": ""
            },
            "properties": [],
            "quantity": 1,
            "title": "[Test] Mens T-Shirt - Small",
            "variant": {
                "id": 39663258009636,
                "sku": "test123"
            }
        }
    ],
    "subtotalPrice": "0.50",
    "totalPrice": "1.58",
    "currency": "USD",
    "discounts": [
        {
            "type": "PercentageDiscount",
            "code": "90OFF",
            "amount": "4.50"
        }
    ],
    "customer": {
        "id": 5403815936036,
        "email": "joncairo@gmail.com",
        "acceptsMarketing": false,
        "hasAccount": false,
        "firstName": "Jonathan",
        "lastName": "Cairo",
        "ordersCount": 37,
        "totalSpent": "258.44"
    }
}