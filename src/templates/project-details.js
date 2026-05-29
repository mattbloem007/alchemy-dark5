import React, { useEffect } from 'react';
import {GatsbyImage} from 'gatsby-plugin-image'
import { FiList, FiArrowLeftCircle } from "react-icons/fi";
import { graphql, Link } from 'gatsby'
import Calltoaction from '../elements/calltoaction/calltoaction'
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, MARKS } from "@contentful/rich-text-types"

const offeringMeta = {
  restoration: {
    title: '1:1 Restoration Sessions',
    description: 'Personalized nervous system restoration sessions combining herbal guidance, embodiment practices, lifestyle support, breathwork, and restorative daily rituals.',
    cta: 'Book a Session'
  },
  journeys: {
    title: 'Nutritional Journeys',
    description: 'Seasonal guided journeys exploring cacao, nourishment, cleansing, ritual, nervous system health, and embodied wellbeing through simple sustainable practices.',
    cta: 'Explore Journeys'
  },
  veera: {
    title: 'Vee/Ra Botanical Blends',
    description: 'Herbal elixirs and cacao blends designed to support restoration, sustained energy, grounding, and everyday ritual.',
    cta: 'Visit Vee/Ra'
  }
};

const Bold = ({ children }) => <span style={{color: "#111111"}}>{children}</span>
const Text = ({ children }) => <p style={{color: "#1f1f1f", textAlign: "left"}}>{children}</p>

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

const ProjectDetails = ({data, location}) => {
    const projectData = data.contentfulProjects;
  const offeringKey = new URLSearchParams(location?.search || '').get('offering');
  const selectedOffering = offeringMeta[offeringKey] || null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
  }, [location?.pathname, location?.search]);

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
                                                <Link to="/#portfolio"><FiArrowLeftCircle size={50} /></Link>
                                                <div className="page-top" style={{display: "flex", justifyContent: "center", textAlign: "center"}}>
                                                  <h1 className="title_holder">{selectedOffering?.title || projectData.title}</h1>
                                                </div>
                                                <div className="thumbnail mt_md--40 mt_sm--40" style={{display: "flex", justifyContent: "center"}}>
                                                  <GatsbyImage image={projectData.featured_image.fixed} alt={projectData.title}/>
                                                </div>
                                                {selectedOffering?.description && (
                                                  <p className="mt--30" style={{maxWidth: 720}}>{selectedOffering.description}</p>
                                                )}
                                                <h3 className="mt--20">Details</h3>
                                                <ul className="list_holder">
                                                    <li><span className="icon"><FiList />Category:</span><span className="projectinfo">{projectData.category}</span></li>
                                                    {/**<li><span className="icon"><FiUser />Client:</span><span className="projectinfo">{projectData.client}</span></li>
                                                    <li><span className="icon"><FiInstagram />Images by:</span><span className="projectinfo">{projectData.imgesBY}</span></li>*/}
                                                </ul>
                                                {projectData.body ? documentToReactComponents(JSON.parse(data.contentfulProjects.body.raw, options)) : null}
                                                <Link style={{display: "flex", justifyContent: "center"}} to={`/store/${projectData.projectId}`}><Calltoaction title="" buttonText={selectedOffering?.cta || 'Join this Journey'} /></Link>
                                                <Link to="/#portfolio"><FiArrowLeftCircle size={50} /></Link>
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
query ProjectQuery($permalink: String!) {
  contentfulProjects (permalink: { eq: $permalink } ){
            id
            permalink
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
