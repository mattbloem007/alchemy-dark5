import React, { useEffect, useState } from 'react';
import { graphql } from "gatsby";
import Post from "../components/post";
import Layout from "../components/layout";
import Img from 'gatsby-image'
import Calltoaction from '../elements/calltoaction/calltoaction'
import Collapsible from "react-collapsible-paragraph";
import ImageGalleryComponent from '../components/imageGallery'
import commerce from '../lib/Commerce';
import { isMobile } from "react-device-detect";

const Product = (props) => {
    console.log("Data", props)
    let data = props.data
    const [product, setProduct] = useState({});
    let urlString = data.checProduct.image.url.split("|")
    let url = urlString[0] + "%7C" + urlString[1]

    useEffect(() => {
      commerce.products.retrieve(data.checProduct.id)
      .then(product => setProduct(product.assets))
    }, []);

    const handleAddToCart = () => {
      props.onAddToCart(data.checProduct.id, 1);
      if (isMobile && props.isOverlayOpen == false) {
        props.setOverlay(true)
        document.querySelector('.trigger-popup-menu').classList.toggle('overlay-wrapper-open');
        document.querySelector('.hambergur-menu').classList.toggle('hambergur-menu-open');
      }
      props.setCartVisible(!props.isCartVisible)

    }

    const htmlToText = (html) => {
        return html.replace(/(<([^>]+)>)/g, " ")
    }
    let desc = htmlToText(data.checProduct.description)
    console.log("Product", product)
    return (
        <>
            <div className="rn-category-post rn-section-gap bg-color-white">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="page-top">
                                <h1 className="title_holder">{data.checProduct.name}</h1>
                                <div className="breadcrumbs-area">
                                    <ul className="breadcrumbs">
                                        <li><a href="/">Home</a></li>
                                        <li className="separator"><span></span></li>
                                        <li className="active">Shop</li>
                                        <li className="separator"><span></span></li>
                                        <li className="active">{data.checProduct.categories[0].name}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row row--25">
                      <div className="col-lg-4">
                        {Object.entries(product).length !== 0 &&  <ImageGalleryComponent images={product} />/**<Img fluid={data.file.childImageSharp.fluid}/>*/}
                      </div>
                      <div className="col-lg-8">
                      <div className="content">
                          <div className="inner">
                              {data.checProduct.name && <h4 className="title">{data.checProduct.name}</h4>}
                              {data.checProduct.price.formatted_with_symbol && <span className="category">{data.checProduct.price.formatted_with_symbol}</span>}
                              {data.checProduct.description && <div style={{ lineHeight: "22px"}}><Collapsible lines={4} locales={{expand:'read more', collapse:'read less'}}>{desc }</Collapsible></div>}
                          </div>
                          <Calltoaction title="" buttonText="Add to Cart" action={handleAddToCart} />
                      </div>
                      </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export const allCategoryQueryData = graphql`
    query oneProductQuery ($id: String!, $url: String!) {
      checProduct(id: {eq: $id}) {
        id
        description
        price {
          formatted_with_symbol
        }
        image {
          url
        }
        name
        categories {
          name
        }
      }

      file(url: {eq: $url}) {
        name
        url
        childImageSharp {
          fluid(maxWidth: 374, maxHeight: 374, quality: 100) {
            ...GatsbyImageSharpFluid_withWebp
            presentationWidth
            presentationHeight
          }
          id
        }
      }
    }
`



export default Product;
