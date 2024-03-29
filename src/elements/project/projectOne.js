import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import Projectcard from "./projectcard";


const ProjectOne = () => {
    const ProjectData = useStaticQuery(graphql`
        query ProjectDataQuery {
          allContentfulProjects {
            edges {
              node {
                id
                name
                title
                category
                projectId
                featured_image {
                fixed: gatsbyImageData(layout: FIXED, width: 374, height: 374)
                file {
                  url
                }
            }
              }
            }
          }
        }
    `);

    const projectsData = ProjectData.allContentfulProjects.edges;
    console.log("project data", projectsData)
    return (
        <div className="row row--45 mt_dec--30">
            {projectsData.map( data => (
                <Projectcard key={data.node.id}
                    column="col-lg-6 col-12"
                    portfolioStyle="portfolio-style-1"
                    key={data.node.id}
                    id={data.node.name}
                    image={data.node.featured_image}
                    title={data.node.title}
                    category={data.node.category}
                />
            ))}
        </div>
    )
}

export default ProjectOne;
