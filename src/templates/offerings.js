import React from "react";
import { Link } from "gatsby";
import SEO from "../components/seo";

const OfferingsTemplate = ({ pageContext }) => {
  const { products = [], error = "" } = pageContext || {};

  return (
    <>
      <SEO title="Offerings" description="Browse offerings from Stripe catalog." />
      <div className="rn-post-list-page rn-section-gap bg-color-white">
        <div className="container">
          <div className="col-lg-12">
            <div className="page-top">
              <h1 className="title_holder">Offerings</h1>
            </div>
          </div>
          {error && <p style={{ color: "red", padding: "20px" }}>{error}</p>}
          <div className="row row--45 mt_dec--30">
            {products.map((product) => (
              <div className="col-lg-4 col-md-6 col-12" key={product.id}>
                <div className="portfolio">
                  <div className="thumbnail">
                    <Link to={`/store/${product.id}`}>
                      <img
                        src={product.images?.[0] || "/images/portfolio/project-01.jpg"}
                        alt={product.name}
                      />
                    </Link>
                  </div>
                  <div className="content">
                    <div className="inner">
                      <h4 className="title">
                        <Link to={`/store/${product.id}`}>{product.name}</Link>
                      </h4>
                      <span className="category">{product.price?.formatted_with_symbol}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferingsTemplate;
