import React from 'react';
import { Link } from 'gatsby';
import {useStaticQuery, graphql} from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { slugify } from '../../utils/utilityFunctions';

const offeringsContent = [
    {
        key: 'restoration',
        title: '1:1 Restoration Sessions',
        description: 'Personalized nervous system restoration sessions combining herbal guidance, embodiment practices, lifestyle support, breathwork, and restorative daily rituals.',
        cta: 'Book a Session'
    },
    {
        key: 'journeys',
        title: 'Nutritional Journeys',
        description: 'Seasonal guided journeys exploring cacao, nourishment, cleansing, ritual, nervous system health, and embodied wellbeing through simple sustainable practices.',
        cta: 'Explore Journeys'
    },
    {
        key: 'veera',
        title: 'Vee/Ra Botanical Blends',
        description: 'Herbal elixirs and cacao blends designed to support restoration, sustained energy, grounding, and everyday ritual.',
        cta: 'Visit Vee/Ra'
    }
];

const Project = () => {
    const portfolioData = useStaticQuery(graphql`
        query portfolioDataQuery {
            homedefaultJson(name: {eq: "portfolio"}) {
                title
                description
                offeringProjectMap {
                    key
                    projectName
                }
            }

            allContentfulProjects(limit: 100) {
                edges {
                    node {
                        id
                        permalink
                        title
                        projectId
                        featured_image {
                            fixed: gatsbyImageData(layout: FIXED, width: 374, height: 374)
                        }
                    }
                }
            }
        }
    `);
    const Title = portfolioData.homedefaultJson.title;
    const Description = portfolioData.homedefaultJson.description;
    const configuredMap = portfolioData.homedefaultJson.offeringProjectMap || [];
    const projects = portfolioData.allContentfulProjects.edges;
    const normalizeValue = (value = '') => value.trim().toLowerCase();

    const projectsByName = projects.reduce((acc, entry) => {
        const node = entry.node;
        const candidates = [node?.permalink, node?.title, node?.id]
            .filter(Boolean)
            .map((value) => normalizeValue(value));

        if (!candidates.length) {
            return acc;
        }

        candidates.forEach((key) => {
            acc[key] = node;
        });
        return acc;
    }, {});

    const configuredProjectByOffering = configuredMap.reduce((acc, item) => {
        if (!item?.key || !item?.projectName) {
            return acc;
        }

        const projectNode = projectsByName[normalizeValue(item.projectName)];
        if (projectNode) {
            acc[item.key] = projectNode;
        }
        return acc;
    }, {});

    return (
        <div className="rn-portfolio-area section-tone-dark pt--100 pb--150 portfolio-style-1 offerings-showcase">
            <div className="container">
                <div className="row mb--10">
                    <div className="col-lg-12">
                        <div className="section-title" style={{textAlign: "center"}}>
                            <h3 className="title">
                                {Title}
                                <span className="bg">Offerings</span>
                            </h3>
                            {Description && <p className="description mt--20">{Description}</p>}
                        </div>
                    </div>
                </div>
                <div className="row row--45 mt_dec--30">
                    {offeringsContent.map((offering, index) => {
                        const project = configuredProjectByOffering[offering.key] || projects[index]?.node;
                        const projectSlug = project?.permalink ? slugify(project.permalink) : null;
                        const path = projectSlug ? `/project/${projectSlug}?offering=${offering.key}` : '/shop/offerings';

                        return (
                            <div className="col-lg-4 col-md-6 col-12" key={offering.title}>
                                <div className="portfolio offering-card">
                                    <div className="thumbnail">
                                        <Link to={path}>
                                            {project?.featured_image?.fixed && (
                                                <GatsbyImage image={project.featured_image.fixed} alt={offering.title} />
                                            )}
                                            {!project?.featured_image?.fixed && (
                                                <div className="offering-image-fallback" aria-hidden="true" />
                                            )}
                                        </Link>
                                    </div>
                                    <div className="content" style={{textAlign: 'left'}}>
                                        <div className="inner">
                                            <h4 className="title">
                                                <Link to={path}>{offering.title}</Link>
                                            </h4>
                                            <p className="category">{offering.description}</p>
                                            <div className="button-group mt--20">
                                                <Link className="rn-button" to={path}>
                                                    <span>{offering.cta}</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="button-group mt--60 justify-content-center">
                            <Link className="rn-button offerings-all-button" to="/shop/offerings">
                                <span>Explore All Offerings</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Project
