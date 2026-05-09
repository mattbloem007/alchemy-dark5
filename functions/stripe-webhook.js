const Stripe = require('stripe');
const axios = require('axios');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const omnisendApiKey = process.env.OMNISEND_API_KEY;

const stripe = new Stripe(stripeSecretKey);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      stripeWebhookSecret
    );
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the checkout.session.completed event
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    try {
      // Extract customer info
      const email = session.customer_email;
      const firstName = session.metadata?.customer_first_name || '';
      const lastName = session.metadata?.customer_last_name || '';
      const automationId = session.metadata?.automation_id; // Get automation ID from session metadata
      const courseId = session.metadata?.course_id;

      if (!email) {
        console.warn('No email found in Stripe session');
        return {
          statusCode: 200,
          body: JSON.stringify({ received: true }),
        };
      }

      if (!automationId) {
        console.warn('No automation ID found in session metadata');
        return {
          statusCode: 200,
          body: JSON.stringify({ received: true }),
        };
      }

      // Add contact to Omnisend and trigger automation
      await addContactToOmnisend({
        email,
        firstName,
        lastName,
        automationID: automationId,
        courseId,
      });

      console.log(`Successfully added ${email} to Omnisend automation ${automationId} for course ${courseId}`);
    } catch (err) {
      console.error('Error processing Omnisend:', err);
      // Don't fail the webhook - Stripe needs a 200 response
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};

async function addContactToOmnisend({ email, firstName, lastName, automationID }) {
  const omnisendBaseUrl = 'https://api.omnisend.com/v3';

  // Create or update contact
  const contactPayload = {
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    tags: ['course-purchase'],
  };

  const contactResponse = await axios.post(
    `${omnisendBaseUrl}/contacts`,
    contactPayload,
    {
      headers: {
        'X-API-Key': omnisendApiKey,
        'Content-Type': 'application/json',
      },
    }
  );

  const contactID = contactResponse.data.contactID;

  // Add contact to automation if provided
  if (automationID) {
    await axios.post(
      `${omnisendBaseUrl}/contacts/${contactID}/automations`,
      { automationID },
      {
        headers: {
          'X-API-Key': omnisendApiKey,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return contactID;
}
