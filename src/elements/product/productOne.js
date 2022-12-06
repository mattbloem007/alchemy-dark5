import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import Productcard from "./productcard";


const ProductOne = () => {
    const ProductData = useStaticQuery(graphql`
      query featureItemQuery {
        allChecProduct {
          edges {
            node {
              id
              name
              image {
                url
              }
              categories {
                name
              }
              price {
                formatted_with_symbol
              }
            }
          }
        }

        allFile {
          edges {
            node {
              name
              url
              childImageSharp {
                  fluid(maxWidth: 374, maxHeight: 374, quality: 100) {
                      ...GatsbyImageSharpFluid_withWebp
                      presentationWidth
                      presentationHeight
                  }
              }
            }
          }
        }
      }
    `);

    const productData = ProductData.allChecProduct.edges;
    const filesData = ProductData.allFile.edges


    return (
        <div className="row row--45 mt_dec--30">
            {productData.map( data => {
              let urlString = data.node.image.url.split("|")
              let url = urlString[0] + "%7C" + urlString[1]
              let fluidImage = null
              filesData.map(file => {
                if (file.node.url) {
                  if (file.node.url == url) {
                    fluidImage = file
                  }
                }
              })
              return(
                <Productcard key={data.node.id}
                    column="col-lg-4 col-md-6 col-12"
                    portfolioStyle="portfolio-style-1"
                    key={data.node.id}
                    id={data.node.id}
                    image={fluidImage.node.childImageSharp}
                    title={data.node.name}
                    category={data.node.categories[0].name}
                    price={data.node.price.formatted_with_symbol}å
                />
            )})}
        </div>
    )
}

export default ProductOne;
