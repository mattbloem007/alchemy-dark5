import React from 'react';
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/layout";
import ProductOne from "../elements/product/productOne";
import SEO from "../components/seo";


const ProductArchive = (props, {data}) => {
    console.log("Props", props)
    return (
        <>
        <SEO title="Ceremonial Cacao" description="Revitalize your energy" />
        <div className="rn-post-list-page rn-section-gap bg-color-white">
            <div className="container">
                <div className="col-lg-12">
                    <div className="page-top">
                        <h1 className="title_holder">Offerings</h1>
                        <div className="breadcrumbs-area">
                            <ul className="breadcrumbs">
                                <li><a href="/">Home</a></li>
                                <li className="separator"><span></span></li>
                                <li className="active">Shop</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <ProductOne />
            </div>
        </div>
        </>
    )
}

// export const query = graphql`
// query featureItemQuery {
//   allChecProduct {
//     edges {
//       node {
//         id
//         name
//         image {
//           url
//         }
//         categories {
//           name
//         }
//       }
//     }
//   }
//
//   allFile {
//     edges {
//       node {
//         name
//         url
//         childImageSharp {
//             fluid(maxWidth: 374, maxHeight: 374, quality: 100) {
//                 ...GatsbyImageSharpFluid_withWebp
//                 presentationWidth
//                 presentationHeight
//             }
//         }
//       }
//     }
//   }
// }
// `

export default ProductArchive;
