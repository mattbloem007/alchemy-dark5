/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */

require("dotenv").config();


module.exports = {
  siteMetadata: {
    title: `Alchemy of Remembrance`,
    description: `Sangoma || Cacao Kuchina || Health & Longevity || Living to create, learn, and explore the truth.`,
    author: `mattb007`,
    siteUrl: "http://localhost:8000/",
    getform_url: "https://getform.io/f/d5a562a3-6d7a-43c4-981c-a402161790b2",
  },
  mapping: {
    "MarkdownRemark.frontmatter.author": `AuthorsJson.name`,
  },
  plugins: [
    {
      resolve: `gatsby-source-open-exchange-rates`,
      options: {
        appId: process.env.OPEN_EXCHANGE_RATES_APP_ID,
        base: "ZAR"
      }
    },
    {
      resolve: `gatsby-plugin-paypal`,
      options: {
        clientId: process.env.PAY_PAL_CLIENT_ID,
        vault: true // Optional
      }
    },
    {
      resolve: "@chec/gatsby-source-chec",
      options: {
        publicKey: process.env.NEXT_PUBLIC_CHEC_PUBLIC_KEY,
        //downloadImageAssets: true,
      },
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
        host: process.env.CONTENTFUL_HOST
      },
    },
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images/`,
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
        options: {
            fonts: [
              `Montserrat ital`,
              `sans-serif\:300`, `300i`, `400`, `400i`, `500`, `600`, `700`, `900`
          ],
          fonts: [
            `Mulish`,
            `sans-serif\:300`, `400`, `500`, `600`, `700`
          ],
          display: 'swap',
        },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/assets/images/TAoR_Logo.jpeg`, // This path is relative to the root of the site.
      },
    },
    {
        resolve: "gatsby-plugin-anchor-links",
        options: {
          offset: -100
        }
    },

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1920
            },
          },
        ],
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-transformer-json`,
  ],
}
