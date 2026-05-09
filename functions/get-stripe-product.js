const Stripe = require("stripe");

exports.handler = async (event) => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" })
    };
  }

  const id = event.queryStringParameters?.id;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing product id" })
    };
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const product = await stripe.products.retrieve(id, {
      expand: ["default_price"]
    });

    const defaultPrice = product.default_price || null;
    const amount = defaultPrice?.unit_amount || 0;
    const currency = (defaultPrice?.currency || "zar").toUpperCase();

    return {
      statusCode: 200,
      body: JSON.stringify({
        product: {
          id: product.id,
          name: product.name,
          description: product.description || "",
          images: Array.isArray(product.images) ? product.images : [],
          metadata: product.metadata || {},
          price: {
            id: defaultPrice?.id || null,
            raw: amount / 100,
            unit_amount: amount,
            currency,
            formatted_with_symbol: new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency
            }).format(amount / 100)
          }
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Unable to fetch Stripe product" })
    };
  }
};
