
const { slugify } = require('./src/utils/utilityFunctions');
const path = require('path');
const _ = require('lodash');
const fetch = require('node-fetch');


exports.onCreateNode = async ({node , actions, store, createNodeId, cache }) => {
    const { createNodeField, createNode } = actions;
    if (node.internal.type === 'MarkdownRemark') {
        const slugFromTitle = slugify(node.frontmatter.title)
        createNodeField({
            node,
            name: 'slug',
            value: slugFromTitle,
        });

        if (Object.prototype.hasOwnProperty.call(node.frontmatter, "author")) {
            createNodeField({
              node,
              name: "authorId",
              value: slugify(node.frontmatter.author)
            });
        }
    }

    if(node.internal.type === 'AuthorsJson'){
        createNodeField({
            node,
            name: "authorId",
            value: slugify(node.name)
        });
    }

}

exports.createPages = async ({actions, graphql}) => {
    const { createPage } = actions;
    const templates =  {
        projectDetails: path.resolve('src/templates/project-details.js'),
        blogDetails: path.resolve('src/templates/blog-details.js'),
        categoryPost: path.resolve('src/templates/category-post.js'),
        tagPost: path.resolve('src/templates/tag-template.js'),
        authorPage: path.resolve('src/templates/archive.js'),
        //productPage: path.resolve('src/templates/product.js'),
    }

    return graphql(`
        {
          allContentfulProjects {
            edges {
              node {
                permalink
                title
              }
            }
          }

            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                            authorId
                        }
                        frontmatter {
                            author {
                                name
                            }
                            tags
                            category
                        }
                    }
                }
            }


        }
    `).then( async res => {
        if (res.errors) return Promise.reject(res.errors)
        const project = res.data.allContentfulProjects.edges
        const posts = res.data.allMarkdownRemark.edges
         // Create Project Page
         project.forEach(({ node }) => {
          const projectSlugSource = node.permalink || node.title || '';
          if (!projectSlugSource) {
            return;
          }

          const projectSlug = slugify(projectSlugSource);
          console.log("project", projectSlug)
            createPage({
            path: `project/${projectSlug}`,
                component: templates.projectDetails,
                context: {
              permalink: node.permalink
                }
            })
        })

        // Create Single Blog Page
        posts.forEach(({ node }) => {
            createPage({
                path: `${slugify(node.fields.slug)}`,
                component: templates.blogDetails,
                context: {
                    slug: node.fields.slug
                }
            })
        })

        // Create Single Blog Page

        // Start Category Area

        // For get All Categiry Pages
        let categories = []
        _.each(posts , edge => {
            if (_.get(edge , 'node.frontmatter.category')) {
                categories = categories.concat(edge.node.frontmatter.category)
            }
        })

        // [design , code]
        let categoryPostCounts = {}
        categories.forEach( category => {
            categoryPostCounts[category] = (categoryPostCounts[category] || 0) + 1
        })
        categories = _.uniq(categories)


        // Create Tag Posts Pages for indivedual Tag page
        categories.forEach(category => {
            createPage({
                path: `/category/${slugify(category)}`,
                component: templates.categoryPost,
                context: {
                    category
                }
            })
        })
        // End Category Area



        // Start Tags Pages
        let tags = []
        _.each(posts , edge => {
            if (_.get(edge , 'node.frontmatter.tags')) {
                tags = tags.concat(edge.node.frontmatter.tags)
            }
        })
        // Create Tag Posts Pages for indivedual Tag page
        tags.forEach(tag => {
            createPage({
                path: `/tag/${slugify(tag)}`,
                component: templates.tagPost,
                context: {
                    tag
                }
            })
        })
        // End Category Area



        // Start Create Authors Page
        let authors = []
        _.each(posts, edge => {
            if(_.get(edge, 'node.fields.authorId')){
                authors = authors.concat(edge.node.fields.authorId)
            }
        })
        authors = _.uniq(authors)
        authors.forEach(author => {
            createPage({
                path: `/author/${slugify(author)}`,
                component: templates.authorPage,
                context: {
                    author
                }
            })
        })
        // End Create Authors Page

        // Product Page
        // Fetch Stripe products and Contentful descriptions at build time
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
        const contentfulAccessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

        if (stripeSecretKey && contentfulSpaceId && contentfulAccessToken) {
          try {
            const Stripe = require("stripe");
            const stripe = new Stripe(stripeSecretKey);
            
            // Fetch all Stripe products
            const stripeResponse = await stripe.products.list({
              active: true,
              limit: 100,
              expand: ["data.default_price"]
            });

            // Create a page for each product
            for (const stripeProduct of stripeResponse.data) {
              // Query Contentful for extended description
              let contentfulData = null;
              try {
                const contentfulQuery = `
                  query {
                    projectsCollection(where: { projectId: "${stripeProduct.id}" }, limit: 1) {
                      items {
                        permalink
                        title
                        projectId
                        body {
                          json
                        }
                      }
                    }
                  }
                `;

                const contentfulResponse = await fetch(
                  `https://graphql.contentful.com/content/v1/spaces/${contentfulSpaceId}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${contentfulAccessToken}`,
                    },
                    body: JSON.stringify({ query: contentfulQuery }),
                  }
                );

                const contentfulDataResponse = await contentfulResponse.json();
                console.log(`Full Contentful response for ${stripeProduct.id}:`, JSON.stringify(contentfulDataResponse, null, 2));
                console.log(`Checking data.projectsCollection:`, contentfulDataResponse.data?.projectsCollection);
                console.log(`Checking items:`, contentfulDataResponse.data?.projectsCollection?.items);
                contentfulData = contentfulDataResponse.data?.projectsCollection?.items?.[0] || null;
                if (!contentfulData) {
                  console.warn(`No Contentful data found for Stripe product ${stripeProduct.id}`);
                  console.warn(`Available data structure:`, Object.keys(contentfulDataResponse.data || {}));
                }
              } catch (err) {
                console.error(`Failed to fetch Contentful data for product ${stripeProduct.id}:`, err);
              }

              const defaultPrice = stripeProduct.default_price || null;
              const amount = defaultPrice?.unit_amount || 0;
              const currency = (defaultPrice?.currency || "zar").toUpperCase();

              createPage({
                path: `/store/${stripeProduct.id}`,
                component: path.resolve("src/templates/store-product.js"),
                context: {
                  stripeProduct: {
                    id: stripeProduct.id,
                    name: stripeProduct.name,
                    description: stripeProduct.description || "",
                    images: Array.isArray(stripeProduct.images) ? stripeProduct.images : [],
                    metadata: stripeProduct.metadata || {},
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
                  },
                  contentfulProduct: contentfulData
                }
              });
            }
          } catch (err) {
            console.error("Failed to create product pages:", err);
          }

          // Create offerings page with products list at build time
          try {
            const Stripe = require("stripe");
            const stripe = new Stripe(stripeSecretKey);
            
            // Fetch all Stripe products for offerings page
            const offeringsResponse = await stripe.products.list({
              active: true,
              limit: 100,
              expand: ["data.default_price"]
            });

            const products = offeringsResponse.data.map((product) => {
              const defaultPrice = product.default_price || null;
              const amount = defaultPrice?.unit_amount || 0;
              const currency = (defaultPrice?.currency || "zar").toUpperCase();

              return {
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
              };
            });

            const offeringsPageContext = { products };

            // Update offerings pages with products data
            createPage({
              path: "/offerings",
              component: path.resolve("src/templates/offerings.js"),
              context: offeringsPageContext
            });
            createPage({
              path: "/shop/offerings",
              component: path.resolve("src/templates/offerings.js"),
              context: offeringsPageContext
            });
          } catch (err) {
            console.error("Failed to create offerings page:", err);
            // Still create the page without products as fallback
            createPage({
              path: "/offerings",
              component: path.resolve("src/pages/offerings.js"),
              context: {
                products: [],
                error: "Failed to load products"
              }
            });
            createPage({
              path: "/shop/offerings",
              component: path.resolve("src/pages/offerings.js"),
              context: {
                products: [],
                error: "Failed to load products"
              }
            });
          }
        }





    })

}
