import React from 'react';
import {Link} from 'gatsby'
import Image from "../image";
import {GatsbyImage} from 'gatsby-plugin-image'


const Projectcard = ({image, id, title, category, column}) => {
    let projectImg;
    if(image.fixed && typeof image.fixed !== 'function'){
        projectImg = <GatsbyImage image={image.fixed} alt={title}/>;
    } else if(image.fluid){
        projectImg = <Image fluid={image.fluid} alt={title}/>
    } else if(image.fixed){
      console.log("image.gatsbyImageData", image.fixed)
        projectImg = <GatsbyImage image={image.fixed} alt={title}/>
        console.log(projectImg)
    } else{
        projectImg = <img src={image} alt={title}/>
    }
    return (
        <div className={column}>
            <div className="portfolio">
                <div className="thumbnail">
                    <Link to={`/project/${id}`}>
                        {projectImg}
                    </Link>
                </div>
                <div className="content">
                    <div className="inner">
                        {title && <h4 className="title"><Link to={`/project/${id}`}>{title}</Link></h4>}
                        {category && <span className="category"><a href="#category">{category}</a></span>}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Projectcard;
