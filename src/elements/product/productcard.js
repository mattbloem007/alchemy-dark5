import React from 'react';
import {Link} from 'gatsby'
import Image from "../image";
import Img from 'gatsby-image'


const Productcard = ({image, id, permalink, title, category, column, price}) => {
    let projectImg;
    console.log(image)
    if(image.fixed && typeof image.fixed !== 'function'){
        projectImg = <Img fixed={image.fixed} alt={title}/>;
    } else if(image.fluid){
        projectImg = <Image fluid={image.fluid} alt={title}/>
    } else{
        projectImg = <img src={image} alt={title}/>
    }
    return (
        <div className={column}>
            <div className="portfolio">
                <div className="thumbnail">
                    <Link to={`/store/${permalink}`}>
                        {projectImg}
                    </Link>
                </div>
                <div className="content">
                    <div className="inner">
                        {title && <h4 className="title"><Link to={`/store/${permalink}`}>{title}</Link></h4>}
                        {category && <span className="category"><a href="#category">{category}</a><br/></span>}
                        {price && <span className="category">{price}</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Productcard;
