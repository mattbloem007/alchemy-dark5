import React from "react";
import CheckoutForm from "../elements/checkout/checkoutForm";
import { CircleSpinner } from "react-spinners-kit";

const Checkout = (props) => {
  const renderCheckoutForm = () => (
    <CheckoutForm
      fetchShippingOptions={() => {}}
      fetchSubdivisions={() => {}}
      checkoutToken={{ id: "local" }}
      shippingOptions={[]}
      shippingCountries={{ ZA: "South Africa" }}
      shippingSubdivisions={{ GP: "Gauteng" }}
      cart={props.cart}
      productsHas={props.productsHas}
    />
  );
  

  const renderCheckoutSummary = () => (
    <>
      <div className="checkout summary">
        <h4>Order summary</h4>
        {Object.entries(props.cart).length === 0 ? <CircleSpinner size={30} loading={true} /> : null}
        {Object.entries(props.cart).length !== 0 &&
          props.cart.line_items.map((lineItem) => (
            <div key={lineItem.id} className="checkout summary-details">
              <img className="checkout summary-img" src={lineItem.image.url} alt={lineItem.name} />
              <p className="checkout summary-name">
                {lineItem.quantity} x {lineItem.name}
              </p>
              <p className="checkout summary-value">{lineItem.line_total.formatted_with_symbol}</p>
            </div>
          ))}
        <div className="checkout summary-total">
          <p className="checkout summary-price">
            <span>Subtotal:</span>
            {Object.entries(props.cart).length !== 0 && props.cart.subtotal.formatted_with_symbol}
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="rn-post-list-page rn-section-gap bg-color-white">
        <div className="container">
          <div className="page-top">
            <h1 className="title_holder">Checkout</h1>
            <div className="breadcrumbs-area">
              <ul className="breadcrumbs">
                <li>
                  <a href="/">Home</a>
                </li>
                <li className="separator">
                  <span></span>
                </li>
                <li className="active">Checkout</li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">{renderCheckoutForm()}</div>
            <div className="col-lg-6">
              {renderCheckoutSummary()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
