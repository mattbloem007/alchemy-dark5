import React from "react";
import { Link } from "gatsby";
import SEO from "../components/seo";

const normalize = (value = "") => String(value).trim().toLowerCase();

const categoryLabels = {
  session: "Session Offerings",
  journey: "Nutritional Journeys",
};

const categoryAliases = {
  session: ["session", "sessions", "restoration"],
  journey: ["journey", "journeys", "nutritional journey", "nutritional journeys"],
};

const getProductCategory = (product = {}) => {
  return normalize(
    product?.metadata?.category ||
    product?.metadata?.productType ||
    product?.metadata?.type ||
    ""
  );
};

const matchesCategory = (product, selectedCategory) => {
  if (!selectedCategory || selectedCategory === "all") {
    return true;
  }

  const productCategory = getProductCategory(product);
  const allowedValues = categoryAliases[selectedCategory] || [selectedCategory];
  return allowedValues.includes(productCategory);
};

const OfferingsTemplate = ({ pageContext, location }) => {
  const { products = [], error = "" } = pageContext || {};
  const selectedCategory = normalize(new URLSearchParams(location?.search || "").get("category")) || "all";
  const filteredProducts = products.filter((product) => matchesCategory(product, selectedCategory));
  const pageTitle = selectedCategory === "all" ? "Offerings" : (categoryLabels[selectedCategory] || "Offerings");
  const pageDescription = selectedCategory === "all"
    ? "Browse offerings from the full catalog."
    : `Showing ${pageTitle.toLowerCase()} filtered from the full catalog.`;
  const isActive = (category) => selectedCategory === category;
  return (
    <>
      <SEO title={pageTitle} description={pageDescription} />
      <div className="rn-post-list-page rn-section-gap bg-color-white">
        <div className="container">
          <div className="col-lg-12">
            <div className="page-top">
              <h1 className="title_holder">{pageTitle}</h1>
            </div>
          </div>
          {error && <p style={{ color: "red", padding: "20px" }}>{error}</p>}

          <div className="button-group mt--20 mb--40" style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link className={`rn-button secondary offerings-filter-button${isActive("all") ? " active" : ""}`} to="/shop/offerings?category=all">
              <span>All</span>
            </Link>
            <Link className={`rn-button secondary offerings-filter-button${isActive("session") ? " active" : ""}`} to="/shop/offerings?category=session">
              <span>Sessions</span>
            </Link>
            <Link className={`rn-button secondary offerings-filter-button${isActive("journey") ? " active" : ""}`} to="/shop/offerings?category=journey">
              <span>Journeys</span>
            </Link>
          </div>

          <div className="row row--45 mt_dec--30">
            {filteredProducts.map((product) => (
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
            {!filteredProducts.length && !error && selectedCategory !== "all" && (
              <div className="col-lg-12">
                <p style={{ textAlign: "center", padding: "40px 0" }}>
                  No products found for this category yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferingsTemplate;
