import React from 'react';
import { useStaticQuery, graphql } from "gatsby"
import Blog from "./blog";

const BlogPost = () => {
    const blogQueryData = useStaticQuery(graphql`
        query BlogListQuery {
            allMarkdownRemark (limit: 3, sort: {order: DESC, fields: frontmatter___date}) {
                edges {
                    node {
                        fields {
                            slug
                        }
                        excerpt(pruneLength: 83, format: PLAIN, truncate: true)
                        frontmatter {
                            author {
                                name
                            }
                            title
                            date(formatString: "MMM Do, YYYY")
                            format
                            category
                            image {
                                childImageSharp {
                                    fluid(maxWidth: 374, maxHeight: 280, quality: 100) {
                                        ...GatsbyImageSharpFluid_withWebp
                                        presentationWidth
                                        presentationHeight
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    `);

    const blogs = blogQueryData.allMarkdownRemark.edges;
    const essayCategories = [
        'Nervous System & Burnout',
        'Herbal Allies',
        'Daily Rituals',
        'Seasonal Living',
        'Cacao & Embodiment'
    ];

    return (
        <div className="rn-post-area section-tone-light rn-section-gapBottom pt--100" id="news">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title mb--40" style={{textAlign: "center"}}>
                            <h3 className="title">Essays for Embodied Living <span className="bg">Essays</span></h3>
                            <p className="description mt--20">
                                Reflections on nervous system restoration, herbal wellbeing,
                                seasonal living, and grounded daily ritual.
                            </p>
                            <div className="essay-categories mt--30">
                                {essayCategories.map((category) => (
                                    <span key={category}>{category}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row row--45">
                    {blogs.map(blog => (
                        <div className="col-lg-4 col-md-6 col-12 wow fadeInDown" data-wow-delay="200ms" data-wow-duration="0.8s" key={blog.node.fields.slug}>
                            <Blog
                                image={blog.node.frontmatter.image.childImageSharp.fluid}
                                title={blog.node.frontmatter.title}
                                path={blog.node.fields.slug}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BlogPost;
