import React, { useState } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const StoreProductPage = (props) => {
  const { stripeProduct, contentfulProduct } = props.pageContext;
  const [quantity, setQuantity] = useState(1);
  
  console.log("contentful Product:", contentfulProduct);

  if (!stripeProduct) {
    return <div className="container rn-section-gap">Product not found.</div>;
  }

  const handleAddToCart = () => {
    props.onAddToCart(stripeProduct, quantity);
    props.setCartVisible(true);
  };

  const handleBuyNow = () => {
    props.onAddToCart(stripeProduct, quantity);
    window.location.href = "/checkout";
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const stickyBarStyle = {
    position: "fixed",
    top: "60px",
    left: "0",
    right: "0",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eee",
    padding: "12px 0",
    zIndex: 50,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  };

  const mainContentStyle = {
    paddingTop: "180px"
  };

  // Mobile adjustments
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) {
    stickyBarStyle.padding = "8px 0";
    mainContentStyle.paddingTop = "270px";
  }

  return (
    <>
      {/* Sticky CTA Bar - No gap with header */}
      <div style={stickyBarStyle}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
            {/* Product Name & Price (left side) */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div>
                <h5 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#333" }}>
                  {stripeProduct.name}
                </h5>
                <span style={{ fontSize: "14px", color: "var(--color-primary)", fontWeight: "600" }}>
                  {stripeProduct.price?.formatted_with_symbol}
                </span>
              </div>
            </div>

            {/* Quantity & Buttons (right side) */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Quantity Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "500", color: "#666" }}>Qty:</span>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden" }}>
                  <button
                    onClick={decrementQuantity}
                    aria-label="Decrease quantity"
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      borderRight: "1px solid #ddd",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    aria-label="Product quantity"
                    style={{
                      width: "45px",
                      height: "32px",
                      border: "none",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#333",
                      backgroundColor: "#fff"
                    }}
                  />
                  <button
                    onClick={incrementQuantity}
                    aria-label="Increase quantity"
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "none",
                      borderLeft: "1px solid #ddd",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleAddToCart}
                  className="rn-button"
                  aria-label="Add product to cart"
                  style={{ padding: "0 20px", height: "40px", lineHeight: "38px", fontSize: "13px" }}
                >
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="rn-button"
                  aria-label="Buy now and proceed to checkout"
                  style={{ padding: "0 20px", height: "40px", lineHeight: "38px", fontSize: "13px" }}
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Content - with padding top for fixed bar */}
      <div 
        className="rn-category-post rn-section-gap bg-color-white"
        style={mainContentStyle}
      >
        <div className="container">
          <div className="row row--25">
            {/* Product Image */}
            <div className="col-lg-4">
              <img 
                src={stripeProduct.images?.[0] || "/images/portfolio/project-01.jpg"} 
                alt={stripeProduct.name}
              />
            </div>

            {/* Product Details */}
            <div className="col-lg-8">
              <div className="content">
                <div className="inner">
                  <h4 className="title">{stripeProduct.name}</h4>
                  <span className="category">{stripeProduct.price?.formatted_with_symbol}</span>
                  {stripeProduct.description && (
                    <p style={{ marginTop: "12px", marginBottom: "24px" }}>{stripeProduct.description}</p>
                  )}
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "10px" }}>
                    <button
                      onClick={handleAddToCart}
                      className="rn-button"
                      aria-label="Add product to cart"
                      style={{ padding: "0 24px", height: "44px", lineHeight: "42px" }}
                    >
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="rn-button"
                      aria-label="Buy now and proceed to checkout"
                      style={{ padding: "0 24px", height: "44px", lineHeight: "42px" }}
                    >
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>

                {/* Product Description from Contentful */}
                {contentfulProduct?.body?.json && (
                  <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #eee" }}>
                    {documentToReactComponents(contentfulProduct.body.json)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreProductPage;
