const axios = require('axios');

const OMNISEND_API_KEY = process.env.OMNISEND_API_KEY;
const OMNISEND_BASE_URL = 'https://api.omnisend.com/v3';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!OMNISEND_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing OMNISEND_API_KEY' }),
    };
  }

  try {
    const { email, firstName, lastName, automationID, phone } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    // Step 1: Create or update contact in Omnisend
    const contactPayload = {
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || '',
      tags: ['course-purchase'], // Tag for filtering
    };

    const contactResponse = await axios.post(
      `${OMNISEND_BASE_URL}/contacts`,
      contactPayload,
      {
        headers: {
          'X-API-Key': OMNISEND_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const contactID = contactResponse.data.contactID;

    // Step 2: Add contact to automation (if automationID provided)
    if (automationID) {
      await axios.post(
        `${OMNISEND_BASE_URL}/contacts/${contactID}/automations`,
        { automationID },
        {
          headers: {
            'X-API-Key': OMNISEND_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Contact added to Omnisend and automation triggered',
        contactID,
      }),
    };
  } catch (error) {
    console.error('Omnisend error:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.response?.data?.message || error.message,
      }),
    };
  }
};
