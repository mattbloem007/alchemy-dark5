import React from 'react';
import Img from "gatsby-image";
import {GatsbyImage} from 'gatsby-plugin-image'
import Image from "../elements/image";
import { FiList, FiUser, FiInstagram } from "react-icons/fi";
import Layout from "../components/layout";
import { graphql } from 'gatsby'
import Calltoaction from '../elements/calltoaction/calltoaction'
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, MARKS } from "@contentful/rich-text-types"

const Bold = ({ children }) => <span style={{color: "white"}}>{children}</span>
const Text = ({ children }) => <p style={{color: "white", textAlign: "center"}}>{children}</p>

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    [BLOCKS.EMBEDDED_ASSET]: node => {
      return (
        <>
          <h2>Embedded Asset</h2>
          <pre>
            <code>{JSON.stringify(node, null, 2)}</code>
          </pre>
        </>
      )
    },
  },
}

const ProjectDetails = ({data}) => {
    const projectData = data.contentfulProjects;
    console.log("DATA", projectData.featured_image.fullWidth)

    return (
        <>
            <div className="rn-project-details-area rn-section-gap bg-color-white">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="inner">
                                <div className="portfolio-content">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-12">
                                            <div className="content-left">
                                                <div className="page-top">
                                                    <h1 className="title_holder">{projectData.title}</h1>
                                                </div>
                                                {/**<div className="thumbnail mt--90 mt_md--40 mt_sm--40">
                                                  <GatsbyImage image={projectData.featured_image.fixed} alt={projectData.title}/>;
                                                </div>*/}
                                                <h3 className="mt--20">Details</h3>
                                                <ul className="list_holder">
                                                    <li><span className="icon"><FiList />Category:</span><span className="projectinfo">{projectData.category}</span></li>
                                                    {/**<li><span className="icon"><FiUser />Client:</span><span className="projectinfo">{projectData.client}</span></li>
                                                    <li><span className="icon"><FiInstagram />Images by:</span><span className="projectinfo">{projectData.imgesBY}</span></li>*/}
                                                </ul>
                                                {projectData.body ? documentToReactComponents(JSON.parse(data.contentfulProjects.body.raw, options)) : null}
                                                <a href={`/product/${projectData.projectId}`}><Calltoaction title="" buttonText="Join this Journey" /></a>
                                            </div>
                                        </div>

                                    </div>
                                </div>


                              {/**  <div className="image-group">
                                    {projectImage ? projectImage.map((data, index) => (
                                        <div className="single-image mt--30" key={index}>
                                            <Img fluid={data.image.childImageSharp.fluid} />
                                        </div>
                                    ))
                                    :
                                    <div></div>
                                  }
                                </div>*/}


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const query = graphql `
query ProjectQuery($name: String!) {
  contentfulProjects (name: { eq: $name } ){
            id
            name
            title
            body {
              raw
            }
            category
            projectId
            featured_image {
            fixed: gatsbyImageData(layout: FIXED, width: 374, height: 374)
        }
  }
}
`;

export default ProjectDetails;

// query($id: String!) {
//     projectJson(id: {eq: $id}) {
//         id
//         title
//         body
//         category
//         client
//         imgesBY
//         featured_image {
//             childImageSharp {
//                 fluid(maxHeight: 1000, maxWidth: 1920, quality: 100) {
//                     ...GatsbyImageSharpFluid_withWebp
//                     presentationHeight
//                     presentationWidth
//                 }
//             }
//         }
//     }
// }
// ,
// features {
//     image {
//         childImageSharp {
//           fluid(maxWidth: 1920, maxHeight: 1280, quality: 100) {
//             ...GatsbyImageSharpFluid_withWebp
//             presentationWidth
//             presentationHeight
//           }
//         }
//     }
// }
