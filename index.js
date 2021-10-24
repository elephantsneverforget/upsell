{/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-FYNQ742HTX"></script> */}
{/* <script> */}
(function() {
  // set up google analytics
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  gtag('js', new Date());
  gtag('config', 'G-FYNQ742HTX');

  // make sure the initial conversion isn't tracked twice
  if (!Shopify.wasPostPurchasePageSeen) {
    var order = window.Shopify.order;

    // track initial conversion
    gtag('event', 'purchase', {
      affiliation: 'My Shopify Store',
      transaction_id: Number(order.id).toString(),
      value: order.totalPrice,
      currency: order.currency,
      items: order.lineItems.map(function(item) {
        return {
          id: Number(item.id).toString(),
          name: item.title,
          category: item.product.type,
          price: item.price,
          quantity: item.quantity,
          variant: Number(item.variant.sku).toString(),
        };
      }),
    });
  }

  // set up additional conversion tracking
  Shopify.on('CheckoutAmended', function(newOrder, previousOrder) {
    // identify which items were recently added, if any
    var oldItems = previousOrder.lineItems.map(function (line) { return line.id; });

    var addedItems = newOrder.lineItems.filter(
      function (line) { return oldItems.indexOf(line.id) < 0; }
    );

    // no new items were added, so we skip conversion tracking
    if (addedItems.length === 0) {
      return;
    }

    // track additional purchase
    gtag('event', 'purchase', {
      affiliation: 'My Shopify Store',
      transaction_id: Number(order.id).toString(),
      value: order.totalPrice,
      currency: order.currency,
      items: addedItems.map(function (item) {
        return {
          id: Number(item.id).toString(),
          name: item.title,
          category: item.product.type,
          price: item.price,
          quantity: item.quantity,
          variant: Number(item.variant.sku).toString(),
        };
      }),
    });
  });
})();
// </script>