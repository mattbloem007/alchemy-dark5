import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });
    return;
  }

  try {
    const { cart, customer, shippingAddress, shippingOption, successUrl, cancelUrl } = req.body || {};

    if (!cart || !Array.isArray(cart.line_items) || cart.line_items.length === 0) {
      res.status(400).json({ error: "Cart is empty or invalid" });
      return;
    }

    const stripe = new Stripe(stripeSecretKey);

    const line_items = cart.line_items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: (cart.currency?.code || "zar").toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image?.url ? [item.image.url] : []
        },
        unit_amount: Math.round(Number(item.price?.raw || 0) * 100)
      }
    }));

    if (shippingOption?.price?.raw) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: (cart.currency?.code || "zar").toLowerCase(),
          product_data: {
            name: shippingOption.description || "Shipping"
          },
          unit_amount: Math.round(Number(shippingOption.price.raw) * 100)
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customer?.email || undefined,
      metadata: {
        customer_first_name: customer?.firstName || "",
        customer_last_name: customer?.lastName || ""
      },
      shipping_address_collection: shippingAddress
        ? { allowed_countries: ["ZA", "US", "GB", "CA", "AU"] }
        : undefined
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message || "Stripe session failed" });
  }
}
