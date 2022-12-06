
const { slugify } = require('./src/utils/utilityFunctions');
const path = require('path');
const _ = require('lodash');
const {createRemoteFileNode} = require('gatsby-source-filesystem');


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

    if (node.internal.type !== "ChecProduct") {
      return
    }

    // download image and create a File node
    // with gatsby-transformer-sharp and gatsby-plugin-sharp
    // that node will become an ImageSharp
    let urlString = node.image.url.split("|")
    let url = urlString[0] + "%7C" + urlString[1]
    const fileNode = await createRemoteFileNode({
      url: url,
      store,
      cache,
      createNode,
      createNodeId,
    })

    if (fileNode) {
      // link File node to DogImage node
      // at field image
      node.localFile___NODE = fileNode.id
    }

}

exports.createPages = ({actions, graphql}) => {
    const { createPage } = actions;
    const templates =  {
        projectDetails: path.resolve('src/templates/project-details.js'),
        blogDetails: path.resolve('src/templates/blog-details.js'),
        categoryPost: path.resolve('src/templates/category-post.js'),
        tagPost: path.resolve('src/templates/tag-template.js'),
        authorPage: path.resolve('src/templates/archive.js'),
        productPage: path.resolve('src/templates/product.js'),
    }

    return graphql(`
        {
          allContentfulProjects {
            edges {
              node {
                name
              }
            }
          }

            allChecProduct {
              edges {
                node {
                  id
                  name
                  image {
                    url
                  }
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
    `).then( res => {
        if (res.errors) return Promise.reject(res.errors)
        const project = res.data.allContentfulProjects.edges
        const posts = res.data.allMarkdownRemark.edges
        const products = res.data.allChecProduct.edges

         // Create Project Page
         project.forEach(({ node }) => {
           console.log("project", node.name)
            createPage({
                // path: node.fields.slug,
                path: `project/${slugify(node.name)}`,
                component: templates.projectDetails,
                context: {
                    name: node.name
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

        products.forEach(product => {
          let urlString = product.node.image.url.split("|")
          let url = urlString[0] + "%7C" + urlString[1]
            createPage({
                path: `/product/${product.node.id}`,
                component: templates.productPage,
                context: {
                    id: product.node.id,
                    url,
                }
            })
        })




    })

}
