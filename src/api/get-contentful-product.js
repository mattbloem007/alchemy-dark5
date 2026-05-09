export default async function handler(req, res) {
  const { id } = req.query || {};

  if (!id) {
    res.status(400).json({ error: "Missing product ID" });
    return;
  }

  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    res.status(500).json({ error: "Missing Contentful credentials" });
    return;
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
      res.status(response.status).json({
        error: data.errors?.[0]?.message || "Failed to fetch from Contentful",
      });
      return;
    }

    res.status(200).json({
      product: data.data?.productCollection?.items?.[0] || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
}
