exports.default = {
    "Checkout": {
        "Autocomplete": true,
        "apiHost": "elevar-gear.myshopify.com",
        "assetsPath": "//cdn.shopify.com/shopifycloud/shopify",
        "DefaultAddressFormat": "{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}",
        "geolocatedAddress": {
            "lat": 53.633399999999995,
            "lng": -113.5239
        },
        "i18n": {
            "orders": {
                "order_updates": {
                    "title": "Order updates"
                },
                "complete_order": "Complete order",
                "pay_now": "Pay now"
            },
            "shipping_line": {
                "pickup_in_store_label": "Pickup",
                "no_pickup_location": "Your order isn't available for pickup. Enter a shipping address.",
                "shipping_label": "Shipping",
                "shipping_default_value": "Calculated at next step",
                "shipping_free_value": "Free"
            },
            "continue_button": {
                "continue_to_shipping_method": "Continue to shipping",
                "continue_to_payment_method": "Continue to payment"
            },
            "qr_code": {
                "title": "Track on your phone",
                "subtitle": "Scan the code with your phone’s camera to track with Shop.",
                "send_link_to_phone": "Or send a link to your phone"
            }
        },
        "locale": "en",
        "normalizedLocale": "en",
        "moneyFormat": "${{amount}}",
        "page": "thank_you",
        "releaseStage": "production",
        "deployStage": "production",
        "requiresShipping": true,
        "step": "thank_you",
        "token": "3be4f27042c29efdcdc983ee3d2310cb",
        "currency": "USD",
        "estimatedPrice": 1.95,
        "dynamicCheckoutPaymentInstrumentsConfig": {
            "paymentInstruments": {
                "accessToken": "b20b4e202b680d524eda7684b6add6dc",
                "amazonPayConfig": null,
                "applePayConfig": {
                    "shopId": 19018741,
                    "countryCode": "US",
                    "currencyCode": "USD",
                    "merchantCapabilities": [
                        "supports3DS"
                    ],
                    "merchantId": "gid://shopify/Shop/19018741",
                    "merchantName": "Elevar Store",
                    "requiredBillingContactFields": [
                        "postalAddress",
                        "email"
                    ],
                    "requiredShippingContactFields": [
                        "postalAddress",
                        "email"
                    ],
                    "shippingType": "shipping",
                    "supportedNetworks": [
                        "visa",
                        "masterCard",
                        "amex",
                        "discover",
                        "jcb",
                        "elo"
                    ],
                    "total": {
                        "type": "pending",
                        "label": "Elevar Store",
                        "amount": "1.00"
                    }
                },
                "checkoutConfig": {
                    "domain": "store.getelevar.com",
                    "shopId": 19018741
                },
                "shopifyPayConfig": {
                    "domain": "store.getelevar.com",
                    "shopId": 19018741,
                    "accelerated": false,
                    "supportsLogin": true,
                    "experimentTestGroup": false,
                    "merchantId": "gid://shopify/Shop/19018741",
                    "supportsSubscriptions": false
                },
                "currency": "USD",
                "googlePayConfig": {
                    "dynamicBuyFlow": true,
                    "iframeSrc": "https://checkout.shopify.com/19018741/sandbox/costanza_google_pay_iframe",
                    "currency": "USD",
                    "countryCode": "US",
                    "capabilities": {
                        "environment": "PRODUCTION",
                        "allowedPaymentMethods": [
                            {
                                "type": "CARD",
                                "parameters": {
                                    "allowedAuthMethods": [
                                        "PAN_ONLY",
                                        "CRYPTOGRAM_3DS"
                                    ],
                                    "allowedCardNetworks": [
                                        "VISA",
                                        "MASTERCARD",
                                        "AMEX",
                                        "DISCOVER",
                                        "JCB"
                                    ],
                                    "allowPrepaidCards": false,
                                    "billingAddressRequired": true,
                                    "billingAddressParameters": {
                                        "format": "FULL",
                                        "phoneNumberRequired": true
                                    }
                                },
                                "tokenizationSpecification": {
                                    "type": "PAYMENT_GATEWAY",
                                    "parameters": {
                                        "gateway": "shopify",
                                        "gatewayMerchantId": "19018741"
                                    }
                                }
                            }
                        ],
                        "existingPaymentMethodRequired": true,
                        "merchantInfo": {
                            "merchantId": "16708973830884969730",
                            "merchantName": "Elevar Store",
                            "merchantOrigin": "store.getelevar.com",
                            "authJwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJtZXJjaGFudElkIjoiMTY3MDg5NzM4MzA4ODQ5Njk3MzAiLCJtZXJjaGFudE9yaWdpbiI6InN0b3JlLmdldGVsZXZhci5jb20iLCJpYXQiOjE2MzUxMDc1NjB9.KlS7cejXKSaarS5q_N0qmCFh_ZfJwvvxRDwgNPKrzWUHIr3HKAy1d1SjZQeO8gMuTeM-Y7jIwSnJAZA_W0Tj4g"
                        },
                        "emailRequired": true,
                        "shippingAddressRequired": true,
                        "shippingAddressParameters": {
                            "phoneNumberRequired": true,
                            "allowedCountryCodes": [
                                "AC",
                                "AD",
                                "AE",
                                "AF",
                                "AG",
                                "AI",
                                "AL",
                                "AM",
                                "AO",
                                "AR",
                                "AT",
                                "AU",
                                "AW",
                                "AX",
                                "AZ",
                                "BA",
                                "BB",
                                "BD",
                                "BE",
                                "BF",
                                "BG",
                                "BH",
                                "BI",
                                "BJ",
                                "BL",
                                "BM",
                                "BN",
                                "BO",
                                "BQ",
                                "BR",
                                "BS",
                                "BT",
                                "BW",
                                "BY",
                                "BZ",
                                "CA",
                                "CC",
                                "CD",
                                "CF",
                                "CG",
                                "CH",
                                "CI",
                                "CK",
                                "CL",
                                "CM",
                                "CN",
                                "CO",
                                "CR",
                                "CV",
                                "CW",
                                "CX",
                                "CY",
                                "CZ",
                                "DE",
                                "DJ",
                                "DK",
                                "DM",
                                "DO",
                                "DZ",
                                "EC",
                                "EE",
                                "EG",
                                "EH",
                                "ER",
                                "ES",
                                "ET",
                                "FI",
                                "FJ",
                                "FK",
                                "FO",
                                "FR",
                                "GA",
                                "GB",
                                "GD",
                                "GE",
                                "GF",
                                "GG",
                                "GH",
                                "GI",
                                "GL",
                                "GM",
                                "GN",
                                "GP",
                                "GQ",
                                "GR",
                                "GS",
                                "GT",
                                "GW",
                                "GY",
                                "HK",
                                "HN",
                                "HR",
                                "HT",
                                "HU",
                                "ID",
                                "IE",
                                "IL",
                                "IM",
                                "IN",
                                "IO",
                                "IQ",
                                "IS",
                                "IT",
                                "JE",
                                "JM",
                                "JO",
                                "JP",
                                "KE",
                                "KG",
                                "KH",
                                "KI",
                                "KM",
                                "KN",
                                "KR",
                                "KW",
                                "KY",
                                "KZ",
                                "LA",
                                "LB",
                                "LC",
                                "LI",
                                "LK",
                                "LR",
                                "LS",
                                "LT",
                                "LU",
                                "LV",
                                "LY",
                                "MA",
                                "MC",
                                "MD",
                                "ME",
                                "MF",
                                "MG",
                                "MK",
                                "ML",
                                "MM",
                                "MN",
                                "MO",
                                "MQ",
                                "MR",
                                "MS",
                                "MT",
                                "MU",
                                "MV",
                                "MW",
                                "MX",
                                "MY",
                                "MZ",
                                "NA",
                                "NC",
                                "NE",
                                "NF",
                                "NG",
                                "NI",
                                "NL",
                                "NO",
                                "NP",
                                "NR",
                                "NU",
                                "NZ",
                                "OM",
                                "PA",
                                "PE",
                                "PF",
                                "PG",
                                "PH",
                                "PK",
                                "PL",
                                "PM",
                                "PN",
                                "PS",
                                "PT",
                                "PY",
                                "QA",
                                "RE",
                                "RO",
                                "RS",
                                "RU",
                                "RW",
                                "SA",
                                "SB",
                                "SC",
                                "SD",
                                "SE",
                                "SG",
                                "SH",
                                "SI",
                                "SJ",
                                "SK",
                                "SL",
                                "SM",
                                "SN",
                                "SO",
                                "SR",
                                "SS",
                                "ST",
                                "SV",
                                "SX",
                                "SZ",
                                "TA",
                                "TC",
                                "TD",
                                "TF",
                                "TG",
                                "TH",
                                "TJ",
                                "TK",
                                "TL",
                                "TM",
                                "TN",
                                "TO",
                                "TR",
                                "TT",
                                "TV",
                                "TW",
                                "TZ",
                                "UA",
                                "UG",
                                "UM",
                                "US",
                                "UY",
                                "UZ",
                                "VA",
                                "VC",
                                "VE",
                                "VG",
                                "VN",
                                "VU",
                                "WF",
                                "WS",
                                "XK",
                                "YE",
                                "YT",
                                "ZA",
                                "ZM",
                                "ZW"
                            ]
                        }
                    }
                },
                "locale": "en",
                "paypalConfig": {
                    "domain": "store.getelevar.com",
                    "environment": "production",
                    "merchantId": "7ULB9C7UL6RV4",
                    "buttonVersion": "v3",
                    "venmoSupported": true,
                    "locale": "en_US",
                    "shopId": 19018741
                },
                "offsiteConfigs": null,
                "supportsDiscounts": true,
                "supportsGiftCards": false,
                "checkoutDisabled": false
            }
        },
        "applePayConfig": null,
        "hasSellingPlan": false,
        "requiresConfirmationStep": false,
        "cartToken": "69f66acbabd469198c630ae7d10bb0c8",
        "countriesUrl": null,
        "OrderStatus": {}
    },
    "houseNumberNudgeCountries": [
        "AU",
        "AT",
        "BR",
        "CA",
        "DE",
        "IT",
        "MX",
        "NL",
        "ES",
        "CH",
        "US"
    ],
    "autocompleteEnabledCountries": [
        "AU",
        "AT",
        "BE",
        "BR",
        "CA",
        "DK",
        "FR",
        "DE",
        "HK",
        "IN",
        "IT",
        "JP",
        "LU",
        "NL",
        "NZ",
        "SG",
        "ES",
        "CH",
        "US"
    ],
    "clientAttributesCollectionEventName": "client_attributes_checkout",
    "shop": "elevar-gear.myshopify.com",
    "locale": "en",
    "currency": {
        "active": "USD",
        "rate": "1.0"
    },
    "country": "US",
    "theme": {
        "name": "Dawn",
        "id": 120659509284,
        "theme_store_id": 887,
        "role": "main",
        "handle": "null",
        "style": {
            "id": null,
            "handle": null
        }
    },
    "cdnHost": "cdn.shopify.com",
    "checkout": {
        "created_at": "2021-10-24T16:24:30-04:00",
        "currency": "USD",
        "customer_id": 5402803863588,
        "customer_locale": "en",
        "email": "jonathan@getelevar.com",
        "location_id": null,
        "order_id": 4099416031268,
        "payment_due": "8.24",
        "payment_url": "https://deposit.us.shopifycs.com/sessions",
        "phone": null,
        "presentment_currency": "USD",
        "reservation_time": null,
        "reservation_time_left": 0,
        "requires_shipping": true,
        "source_name": "checkout_next",
        "source_identifier": null,
        "source_url": null,
        "subtotal_price": "1.95",
        "taxes_included": false,
        "tax_exempt": false,
        "tax_lines": [],
        "token": "3be4f27042c29efdcdc983ee3d2310cb",
        "total_price": "8.24",
        "total_price_set": {
            "shop_money": {
                "amount": "8.24",
                "currency_code": "USD"
            },
            "presentment_money": {
                "amount": "8.24",
                "currency_code": "USD"
            }
        },
        "total_tax": "0.00",
        "updated_at": "2021-10-24T16:30:51-04:00",
        "version": "edge",
        "line_items": [
            {
                "id": "33be07a058cfa7025acd1581daf83202",
                "key": "33be07a058cfa7025acd1581daf83202",
                "product_id": 6788257415204,
                "variant_id": 39657149366308,
                "sku": "4563504_8746",
                "vendor": "Elevar Store",
                "title": "Trucker Cap",
                "variant_title": "",
                "image_url": "https://cdn.shopify.com/s/files/1/1901/8741/products/retro-trucker-hat-white-front-61745065aa4e2.jpg?v=1635012713",
                "taxable": true,
                "requires_shipping": true,
                "gift_card": false,
                "price": "19.50",
                "compare_at_price": null,
                "line_price": "19.50",
                "properties": {},
                "quantity": 1,
                "grams": 109,
                "fulfillment_service": "printful",
                "applied_discounts": [],
                "discount_allocations": [
                    {
                        "id": null,
                        "amount": "17.55",
                        "description": null,
                        "created_at": null
                    }
                ],
                "tax_lines": []
            }
        ],
        "gift_cards": [],
        "shipping_rate": {
            "handle": "shopify-CA%20Flat%20Rate-6.29",
            "price": "6.29",
            "title": "CA Flat Rate",
            "tax_lines": []
        },
        "shipping_address": {
            "id": 9534747017252,
            "first_name": "Jon",
            "last_name": "C",
            "phone": null,
            "company": null,
            "address1": "1 - 2560 Pegasus Boulevard  NW",
            "address2": "",
            "city": "Edmonton",
            "province": "Alberta",
            "province_code": "AB",
            "country": "Canada",
            "country_code": "CA",
            "zip": "T5E6V4"
        },
        "credit_card": {
            "first_name": "Brad",
            "last_name": "D Redding",
            "first_digits": "474166",
            "last_digits": "8367",
            "brand": "visa",
            "expiry_month": 2,
            "expiry_year": 2024,
            "customer_id": 5402803863588
        },
        "billing_address": {
            "id": 9534747017252,
            "first_name": "Jon",
            "last_name": "C",
            "phone": null,
            "company": null,
            "address1": "1 - 2560 Pegasus Boulevard  NW",
            "address2": "",
            "city": "Edmonton",
            "province": "Alberta",
            "province_code": "AB",
            "country": "Canada",
            "country_code": "CA",
            "zip": "T5E6V4"
        },
        "discount": {
            "amount": "17.55",
            "applicable": true,
            "rate": "0.9",
            "reason": null,
            "uses_remaining": 0,
            "code": "90OFF"
        }
    },
    "ClientAttributesCollection": {
        "trekkie": {
            "integrations": [
                {
                    "options": {
                        "appName": "checkout",
                        "development": false,
                        "defaultAttributes": {
                            "shopId": 19018741,
                            "isMerchantRequest": null,
                            "themeId": 120659509284,
                            "themeCityHash": "11697631709947249798",
                            "contentLanguage": "en",
                            "currency": "USD",
                            "checkoutToken": "3be4f27042c29efdcdc983ee3d2310cb"
                        },
                        "isServerSideCookieWritingEnabled": true,
                        "expectS2SEventId": true,
                        "expectS2SEventEmit": true
                    },
                    "defaultAttributes": {
                        "shopId": 19018741,
                        "isMerchantRequest": null,
                        "themeId": 120659509284,
                        "themeCityHash": "11697631709947249798",
                        "contentLanguage": "en",
                        "currency": "USD",
                        "checkoutToken": "3be4f27042c29efdcdc983ee3d2310cb",
                        "appName": "checkout",
                        "uniqToken": "21270157-5acc-4c94-90d0-790167377c91",
                        "visitToken": "d6011edb-9782-41b3-a7fc-681793d0de1c",
                        "microSessionId": "b4016519-273F-4F68-1481-BAB7993B132B",
                        "microSessionCount": 9,
                        "isPersistentCookie": true
                    }
                },
                {
                    "options": {
                        "anonymizeIp": false,
                        "domain": "auto",
                        "doubleClick": true,
                        "enhancedEcommerce": true,
                        "enhancedLinkAttribution": false,
                        "includeSearch": true,
                        "nonInteraction": false,
                        "siteSpeedSampleRate": "10",
                        "sampleRate": 100,
                        "trackNamedPages": true,
                        "trackingId": "UA-85716787-15"
                    },
                    "shopId": 19018741,
                    "checkoutToken": "3be4f27042c29efdcdc983ee3d2310cb",
                    "visitToken": "d6011edb-9782-41b3-a7fc-681793d0de1c",
                    "uniqueToken": "21270157-5acc-4c94-90d0-790167377c91",
                    "appName": "checkout",
                    "pageCalled": true,
                    "ecommerce": false,
                    "enhancedEcommerceLoaded": false
                },
                {
                    "options": {},
                    "trekkie": {
                        "options": {
                            "appName": "checkout",
                            "development": false,
                            "defaultAttributes": {
                                "shopId": 19018741,
                                "isMerchantRequest": null,
                                "themeId": 120659509284,
                                "themeCityHash": "11697631709947249798",
                                "contentLanguage": "en",
                                "currency": "USD",
                                "checkoutToken": "3be4f27042c29efdcdc983ee3d2310cb"
                            },
                            "isServerSideCookieWritingEnabled": true,
                            "expectS2SEventId": true,
                            "expectS2SEventEmit": true
                        },
                        "defaultAttributes": {
                            "shopId": 19018741,
                            "isMerchantRequest": null,
                            "themeId": 120659509284,
                            "themeCityHash": "11697631709947249798",
                            "contentLanguage": "en",
                            "currency": "USD",
                            "checkoutToken": "3be4f27042c29efdcdc983ee3d2310cb",
                            "appName": "checkout",
                            "uniqToken": "21270157-5acc-4c94-90d0-790167377c91",
                            "visitToken": "d6011edb-9782-41b3-a7fc-681793d0de1c",
                            "microSessionId": "b4016519-273F-4F68-1481-BAB7993B132B",
                            "microSessionCount": 9,
                            "isPersistentCookie": true
                        }
                    },
                    "timestampManager": {},
                    "campaignManager": {}
                },
                {
                    "options": {
                        "facebookAppPixelId": "",
                        "facebookCapiEnabled": false,
                        "agent": "shopify",
                        "source": "trekkie-checkout-classic"
                    },
                    "shopId": 19018741,
                    "checkoutToken": "3be4f27042c29efdcdc983ee3d2310cb",
                    "visitToken": "d6011edb-9782-41b3-a7fc-681793d0de1c",
                    "uniqueToken": "21270157-5acc-4c94-90d0-790167377c91",
                    "appName": "checkout",
                    "pageID": "b401652a-8C71-4786-8A28-96F92288540D"
                }
            ],
            "eventNameToEventIdMapping": {},
            "config": {
                "Trekkie": {
                    "appName": "checkout",
                    "development": false,
                    "defaultAttributes": {
                        "shopId": 19018741,
                        "isMerchantRequest": null,
                        "themeId": 120659509284,
                        "themeCityHash": "11697631709947249798",
                        "contentLanguage": "en",
                        "currency": "USD",
                        "checkoutToken": "3be4f27042c29efdcdc983ee3d2310cb"
                    },
                    "isServerSideCookieWritingEnabled": true,
                    "expectS2SEventId": true,
                    "expectS2SEventEmit": true
                },
                "Google Analytics": {
                    "trackingId": "UA-85716787-15",
                    "domain": "auto",
                    "siteSpeedSampleRate": "10",
                    "enhancedEcommerce": true,
                    "doubleClick": true,
                    "includeSearch": true
                },
                "Session Attribution": {},
                "S2S": {
                    "facebookCapiEnabled": false,
                    "source": "trekkie-checkout-classic"
                },
                "initialDocumentCookie": "loggedConversion=3be4f27042c29efdcdc983ee3d2310cb; hide_shopify_pay_for_checkout=false; cart_currency=USD; __kla_id=eyIkcmVmZXJyZXIiOnsidHMiOjE2MzEwNTk4MjksInZhbHVlIjoiIiwiZmlyc3RfcGFnZSI6Imh0dHBzOi8vc3RvcmUuZ2V0ZWxldmFyLmNvbS8ifSwiJGxhc3RfcmVmZXJyZXIiOnsidHMiOjE2MzQyNDg1NDgsInZhbHVlIjoiIiwiZmlyc3RfcGFnZSI6Imh0dHBzOi8vc3RvcmUuZ2V0ZWxldmFyLmNvbS9jb2xsZWN0aW9ucy9hbGwtcHJvZHVjdHMifX0=; _gcl_au=1.1.2118917582.1635010466; _gid=GA1.2.848453605.1635010466; _fbp=fb.1.1635010467367.1745314304; hubspotutk=ca8a95a0a93b68119c979ea8d7583cd5; __hssrc=1; _ga=GA1.2.43051616.1635010466; FPLC=wTUM9wfu3dhQsaH47HTbh2rJiyeBbqgPcuiq%2BBF3rJnDaSDjgk399qZGYG90%2FhgXXbVmXyWrscN0MxytJzh6zFpXDWy6uTM5w%2FPjT8knf5McyawjZgLrvCRhNhavJg%3D%3D; __hstc=124264789.ca8a95a0a93b68119c979ea8d7583cd5.1635010476754.1635029928982.1635082740942.5; _y=21270157-5acc-4c94-90d0-790167377c91; _shopify_y=21270157-5acc-4c94-90d0-790167377c91; ocu_cart_items=%5B%2239657149366308%3Ad864aa79c8eae3b31fecbd4134875ee6%22%5D; ocu_popup_token=e2bccf9e3ce748cdb9af6da6f81e2101; ocu_accepted=false; ocu_countdown=; localization=; _ga_NL30XYJ22C=GS1.1.1635093167.7.0.1635093167.60; _s=d6011edb-9782-41b3-a7fc-681793d0de1c; _shopify_s=d6011edb-9782-41b3-a7fc-681793d0de1c; shopify_pay_redirect=pending; _shopify_ga=_ga=2.15605951.848453605.1635010466-43051616.1635010466; _shopify_evids=pv%3D7880d74807ed6f2cf4d1e88ed3e1c6c5e6956870a307f490c9da94c903e50e27"
            },
            "navigationInfo": {
                "navigationType": "navigate",
                "navigationApi": "PerformanceNavigationTiming"
            },
            "trekkie": {
                "options": {
                    "appName": "checkout",
                    "development": false,
                    "defaultAttributes": {
                        "shopId": 19018741,
                        "isMerchantRequest": null,
                        "themeId": 120659509284,
                        "themeCityHash": "11697631709947249798",
                        "contentLanguage": "en",
                        "currency": "USD",
                        "checkoutToken": "3be4f27042c29efdcdc983ee3d2310cb"
                    },
                    "isServerSideCookieWritingEnabled": true,
                    "expectS2SEventId": true,
                    "expectS2SEventEmit": true
                },
                "defaultAttributes": {
                    "shopId": 19018741,
                    "isMerchantRequest": null,
                    "themeId": 120659509284,
                    "themeCityHash": "11697631709947249798",
                    "contentLanguage": "en",
                    "currency": "USD",
                    "checkoutToken": "3be4f27042c29efdcdc983ee3d2310cb",
                    "appName": "checkout",
                    "uniqToken": "21270157-5acc-4c94-90d0-790167377c91",
                    "visitToken": "d6011edb-9782-41b3-a7fc-681793d0de1c",
                    "microSessionId": "b4016519-273F-4F68-1481-BAB7993B132B",
                    "microSessionCount": 9,
                    "isPersistentCookie": true
                }
            }
        },
        "checkoutToken": "3be4f27042c29efdcdc983ee3d2310cb"
    }
}