const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { id } = event.queryStringParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing product ID" }),
    };
  }

  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Contentful credentials" }),
    };
  }

  try {
    const query = `
      query {
        productCollection(where: { productId: "${id}" }, limit: 1) {
          items {
            productId
            description {
              json
            }
          }
        }
      }
    `;

    const response = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${spaceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.errors?.[0]?.message || "Failed to fetch from Contentful",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        product: data.data?.productCollection?.items?.[0] || null,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Server error" }),
    };
  }
};
