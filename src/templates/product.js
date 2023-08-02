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

//<Collapsible lines={4} locales={{expand:'read more', collapse:'read less'}}>{desc}</Collapsible>

const Product = (props) => {
    console.log("Data", props)
    let data = props.data
    const [product, setProduct] = useState({});
    const [productPrice, setPrice] = useState(data.checProduct.price.formatted_with_symbol);
    const [variantId, setVariantId] = useState()
    let urlString = data.checProduct.image.url.split("|")
    let url = urlString[0] + "%7C" + urlString[1]

    useEffect(() => {
      commerce.products.retrieve(data.checProduct.id)
      .then(product => setProduct(product.assets))

      handleFetchVariants()
    }, []);

    const handleAddToCart = () => {
      if (variantId) {
        props.onAddToCart(data.checProduct.has, data.checProduct.id, 1, variantId);
      }
      else {
        props.onAddToCart(data.checProduct.has, data.checProduct.id, 1);
      }
      if (isMobile && props.isOverlayOpen == false) {
        props.setOverlay(true)
        document.querySelector('.trigger-popup-menu').classList.toggle('overlay-wrapper-open');
        document.querySelector('.hambergur-menu').classList.toggle('hambergur-menu-open');
      }
      props.setCartVisible(!props.isCartVisible)

    }

    const handleFetchVariants = () => {
      props.onFetchVariants(data.checProduct.id)
    }

    const handleChangeProduct = (e) => {
      let obj = props.variants.variant.data.find(o => o.description === e.target.value);
      setPrice(obj.price.formatted_with_symbol)
      setVariantId(obj.options)
    }

    const htmlToText = (html) => {
        return html.replace(/(<([^>]+)>)/g, " ")
    }
    let desc = htmlToText(data.checProduct.description)
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
                              {props.variants.variant.data && <div className="row" style={{marginBottom: "20px"}}>
                                <div className="col-lg-4">
                                  <label htmlFor="subject">Size:</label>
                                </div>
                                <div className="col-lg-8">
                                  <select
                                    className="form-select"
                                    style={{width: "50%", textAlign: "center", fontSize: "1.5rem"}}
                                    name="size"
                                    id="size"
                                    onChange={handleChangeProduct}
                                    >
                                    <option>-----Select Size-----</option>
                                    {
                                      props.variants.variant.data && props.variants.variant.data.length !== 0  && props.variants.variant.data.map((index) => {
                                        return (
                                          <option value={index.description} key={index.id}>{index.description}</option>
                                        )
                                      })
                                    }
                                    </select>
                                  </div>
                              </div>
                            }
                              {productPrice && <span className="category">{productPrice}</span>}
                              {data.checProduct.description && <div style={{ lineHeight: "22px"}} dangerouslySetInnerHTML={{__html: data.checProduct.description}}></div>}
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
        has {
          digital_delivery
          physical_delivery
        }
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
