const Stripe = require("stripe");

exports.handler = async () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" })
    };
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const response = await stripe.products.list({
      active: true,
      limit: 100,
      expand: ["data.default_price"]
    });

    const products = response.data.map((product) => {
      const defaultPrice = product.default_price || null;
      const amount = defaultPrice?.unit_amount || 0;
      const currency = (defaultPrice?.currency || "zar").toUpperCase();

      return {
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
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ products })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Unable to list Stripe products" })
    };
  }
};
