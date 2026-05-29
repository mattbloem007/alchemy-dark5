const Stripe = require('stripe');
const axios = require('axios');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const sequenzyApiKey = process.env.SEQUENZY_API_KEY;

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
    const isLocalDev =
      process.env.NETLIFY_DEV === 'true' ||
      process.env.NODE_ENV !== 'production';

    if (!isLocalDev) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      };
    }

    console.warn('Webhook signature verification skipped in local dev:', err.message);
    try {
      stripeEvent = JSON.parse(event.body);
    } catch (parseErr) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Webhook parse error: ${parseErr.message}` }),
      };
    }
  }

  // Handle the checkout.session.completed event
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    try {
      // Extract customer info
      // Stripe may provide email in different fields depending on checkout mode/customer behavior.
      let email =
        session.customer_email ||
        session.customer_details?.email ||
        null;

      // Fallback: if only a customer id exists, fetch the customer record.
      if (!email && session.customer) {
        try {
          const customer = await stripe.customers.retrieve(session.customer);
          if (!customer.deleted) {
            email = customer.email || null;
          }
        } catch (customerErr) {
          console.warn('Could not load customer email from Stripe customer record:', customerErr.message);
        }
      }
      const firstName = session.metadata?.customer_first_name || '';
      const lastName = session.metadata?.customer_last_name || '';
      // automation_id maps to the Sequenzy sequence-triggering tag name
      const sequenceTag = session.metadata?.automation_id;
      const courseId = session.metadata?.course_id;

      if (!email) {
        console.warn('No email found in Stripe session');
        return {
          statusCode: 200,
          body: JSON.stringify({ received: true }),
        };
      }

      if (!sequenceTag) {
        console.warn('No automation_id / sequence tag found in session metadata');
        return {
          statusCode: 200,
          body: JSON.stringify({ received: true }),
        };
      }

      // Add subscriber to Sequenzy and trigger the sequence via tag
      await addSubscriberToSequenzy({
        email,
        firstName,
        lastName,
        sequenceTag,
        courseId,
      });

      console.log(`Successfully added ${email} to Sequenzy with sequence tag "${sequenceTag}" for course ${courseId}`);
    } catch (err) {
      console.error('Error processing Sequenzy:', err.response?.data || err.message);
      // Don't fail the webhook - Stripe needs a 200 response
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};

async function addSubscriberToSequenzy({ email, firstName, lastName, sequenceTag, courseId }) {
  const sequenzyBaseUrl = 'https://api.sequenzy.com/api/v1';
  const headers = {
    Authorization: `Bearer ${sequenzyApiKey}`,
    'Content-Type': 'application/json',
  };

  // Step 1: Add the general 'course-purchase' tag.
  // Sequenzy auto-creates the subscriber if they don't already exist.
  await axios.post(
    `${sequenzyBaseUrl}/subscribers/tags`,
    { email, tag: 'course-purchase' },
    { headers }
  );

  // Step 2: Update subscriber with name information.
  await axios.patch(
    `${sequenzyBaseUrl}/subscribers/${encodeURIComponent(email)}`,
    {
      firstName: firstName || '',
      lastName: lastName || '',
      customAttributes: { courseId: courseId || '' },
    },
    { headers }
  );

  // Step 3: Add the product-specific tag that triggers the matching Sequenzy sequence.
  // In the Sequenzy dashboard, create a sequence with trigger: "Tag Added" = sequenceTag value.
  await axios.post(
    `${sequenzyBaseUrl}/subscribers/tags`,
    { email, tag: sequenceTag },
    { headers }
  );

  // Step 4: Trigger events for event-based Sequenzy sequences.
  // We fire both a generic event and a sequence-specific event name.
  await axios.post(
    `${sequenzyBaseUrl}/subscribers/events`,
    {
      email,
      event: 'course_purchased',
      properties: {
        courseId: courseId || '',
        sequenceTag: sequenceTag || '',
      },
    },
    { headers }
  );

  if (sequenceTag) {
    await axios.post(
      `${sequenzyBaseUrl}/subscribers/events`,
      {
        email,
        event: sequenceTag,
        properties: {
          courseId: courseId || '',
        },
      },
      { headers }
    );
  }

}
