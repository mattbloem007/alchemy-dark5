import Stripe from "stripe";

export default async function handler(req, res) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });
    return;
  }

  const id = req.query?.id;
  if (!id) {
    res.status(400).json({ error: "Missing product id" });
    return;
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const product = await stripe.products.retrieve(id, {
      expand: ["default_price"]
    });

    const defaultPrice = product.default_price || null;
    const amount = defaultPrice?.unit_amount || 0;
    const currency = (defaultPrice?.currency || "zar").toUpperCase();

    res.status(200).json({
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
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Unable to fetch Stripe product" });
  }
}
