const axios = require('axios');

const SEQUENZY_API_KEY = process.env.SEQUENZY_API_KEY;
const SEQUENZY_BASE_URL = 'https://api.sequenzy.com/api/v1';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!SEQUENZY_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing SEQUENZY_API_KEY' }),
    };
  }

  try {
    const { email, firstName, lastName, sequenceTag, courseId } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    const headers = {
      Authorization: `Bearer ${SEQUENZY_API_KEY}`,
      'Content-Type': 'application/json',
    };

    // Step 1: Add the general 'course-purchase' tag.
    // Sequenzy auto-creates the subscriber if they don't already exist.
    await axios.post(
      `${SEQUENZY_BASE_URL}/subscribers/tags`,
      { email, tag: 'course-purchase' },
      { headers }
    );

    // Step 2: Update subscriber with name and custom attributes.
    await axios.patch(
      `${SEQUENZY_BASE_URL}/subscribers/${encodeURIComponent(email)}`,
      {
        firstName: firstName || '',
        lastName: lastName || '',
        customAttributes: { courseId: courseId || '' },
      },
      { headers }
    );

    // Step 3: Add the product-specific tag to trigger the matching Sequenzy sequence.
    // In the Sequenzy dashboard, create a sequence with trigger: "Tag Added" = sequenceTag.
    if (sequenceTag) {
      await axios.post(
        `${SEQUENZY_BASE_URL}/subscribers/tags`,
        { email, tag: sequenceTag },
        { headers }
      );

      // Trigger sequence-specific event for event-based automations.
      await axios.post(
        `${SEQUENZY_BASE_URL}/subscribers/events`,
        {
          email,
          event: sequenceTag,
          properties: { courseId: courseId || '' },
        },
        { headers }
      );
    }

    // Trigger a generic purchase event for broader automations.
    await axios.post(
      `${SEQUENZY_BASE_URL}/subscribers/events`,
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Subscriber added to Sequenzy${sequenceTag ? ` with sequence tag "${sequenceTag}"` : ''}`,
      }),
    };
  } catch (error) {
    console.error('Sequenzy error:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.response?.data?.error || error.message,
      }),
    };
  }
};
