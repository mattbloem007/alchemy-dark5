const Stripe = require("stripe");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:8000",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  const headers = {
    "Access-Control-Allow-Origin": "http://localhost:8000",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!stripeSecretKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const { cart, customer, shippingAddress, shippingOption, successUrl, cancelUrl, courseId, automationId } = payload;

    if (!cart || !Array.isArray(cart.line_items) || cart.line_items.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Cart is empty or invalid" }),
      };
    }

    const stripe = new Stripe(stripeSecretKey);

    const line_items = cart.line_items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: (cart.currency?.code || "zar").toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image?.url ? [item.image.url] : [],
          metadata: {
            commerce_product_id: item.product_id || "",
            commerce_line_item_id: item.id || "",
          },
        },
        unit_amount: Math.round(Number(item.price?.raw || 0) * 100),
      },
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
        customer_last_name: customer?.lastName || "",
        course_id: courseId || "",
        automation_id: automationId || "",
      },
      shipping_address_collection: shippingAddress
        ? { allowed_countries: ["ZA", "US", "GB", "CA", "AU"] }
        : undefined,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Stripe session failed" }),
    };
  }
};
