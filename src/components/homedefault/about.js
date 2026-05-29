import React from 'react'
import {useStaticQuery, graphql} from 'gatsby';
import Img from "gatsby-image";
import { Controller, Scene } from 'react-scrollmagic';

const renderTextWithLinks = (text, links = []) => {
    if (!text) return null;

    const linkMap = links.reduce((acc, item) => {
        if (item && item.key) {
            acc[item.key] = item;
        }
        return acc;
    }, {});

    const tokenRegex = /{{\s*([\w-]+)\s*}}/g;
    const parts = [];
    let match;
    let lastIndex = 0;

    while ((match = tokenRegex.exec(text)) !== null) {
        const tokenStart = match.index;
        const tokenEnd = tokenRegex.lastIndex;
        const tokenKey = match[1];
        const linkData = linkMap[tokenKey];

        if (tokenStart > lastIndex) {
            parts.push(text.slice(lastIndex, tokenStart));
        }

        if (linkData?.url && linkData?.text) {
            parts.push(
                <a
                    key={`link-${tokenKey}-${tokenStart}`}
                    href={linkData.url}
                    target={linkData.newTab ? '_blank' : undefined}
                    rel={linkData.newTab ? 'noopener noreferrer' : undefined}
                    style={{ textDecoration: 'underline', color: 'orange' }}
                >
                    {linkData.text}
                </a>
            );
        } else {
            parts.push(match[0]);
        }

        lastIndex = tokenEnd;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
};

const About = ( ) => {
    const aboutQueryData = useStaticQuery(graphql`
        query AboutDefaultQuery {
            homedefaultJson (name: {eq: "about"}) {
                title
                description
                descriptionLinks {
                    key
                    text
                    url
                    newTab
                }
                subtitle
                description2
                description3
                description4
                description5

            },
            file(relativePath: {eq: "images/banner/person-image.jpg"}) {
                childImageSharp {
                  fixed (quality: 100, width: 518, height: 480) {
                    ...GatsbyImageSharpFixed
                  }
                }
            }
        }
    `);

    const title = aboutQueryData.homedefaultJson.title;
    const Subtitle = aboutQueryData.homedefaultJson.subtitle;
    const description = aboutQueryData.homedefaultJson.description;
    const descriptionLinks = aboutQueryData.homedefaultJson.descriptionLinks;
    const description2 = aboutQueryData.homedefaultJson.description2;
    const description3 = aboutQueryData.homedefaultJson.description3;
    const description4 = aboutQueryData.homedefaultJson.description4;
    const description5 = aboutQueryData.homedefaultJson.description5;
    const PortfolioImages = aboutQueryData.file.childImageSharp.fixed;


    return (
        <div className="rb-about-area about-style rn-section-gap bg-color-white" id="about">
            <div className="container">
                <div className="row row--45 align-items-center">
                    <div className="col-lg-5">
                        <div className="thumbnail">
                            <div className="trigger" id="trigger2" />
                            <Controller>
                                <Scene classToggle="animated" triggerElement="#trigger2" triggerHook="onCenter">
                                    <div className="rn_surface story-image">
                                        <Img className="about-images" fixed={PortfolioImages} />
                                    </div>
                                </Scene>
                            </Controller>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="inner">
                            <div className="content">
                                <div className="section-title" style={{textAlign: "center"}}>
                                    <div className="title-wrap">
                                        <h3 className="title wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1000ms">{title}<span className="bg">About</span></h3>
                                        {Subtitle && <h4 className="subtitle wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1000ms" dangerouslySetInnerHTML={{ __html: Subtitle }}></h4>}
                                    </div>

                                    {description && <p className="description wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1000ms">{renderTextWithLinks(description, descriptionLinks)}</p>}
                                    {description2 && <p className="description wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1000ms">{renderTextWithLinks(description2)}</p>}
                                    {description3 && <p className="description wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1000ms">{renderTextWithLinks(description3)}</p>}
                                    {description4 && <p className="description wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1000ms">{renderTextWithLinks(description4)}</p>}
                                    {description5 && <p className="description wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1000ms">{renderTextWithLinks(description5)}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
