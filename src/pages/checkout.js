import React, { Component, useEffect, useState, useRef } from "react"
import commerce from '../lib/Commerce';
import CheckoutForm from '../elements/checkout/checkoutForm'
import Layout from "../components/layout";
import { graphql } from "gatsby";
import { CircleSpinner } from "react-spinners-kit";

const Checkout = (props) => {

  const [checkoutToken, setCheckoutToken] = useState({})
  const [subdivisions, setShippingSubDivisions] = useState({})
  const [allCountries, setShippingCountries] = useState({})
  const [country, setShippingCountry] = useState({country: 'ZA'})
  const [options, setShippingOptions] = useState({})
  const [option, setShippingOption] = useState({})
  //const [live, setLive] = useState({})
  const [total, setTotal] = useState({})
  const mounted = useRef();


  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      mounted.current = true;

    } else {
      // do componentDidUpdate logic
      if (Object.entries(props.cart).length !== 0) {
        generateCheckoutToken();
      }
    }

  }, [props.cart]);

  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      mounted.current = true;

    } else {
      // do componentDidUpdate logic
      console.log("checkoutToken2", checkoutToken)
      if (Object.entries(checkoutToken).length !== 0) {
        console.log("fetching options", country.country, checkoutToken)
        fetchShippingOptions(checkoutToken.id, country.country);
        fetchShippingCountries(checkoutToken.id)
      //  getLiveInfo()
      }
    }

  }, [checkoutToken]);


  const generateCheckoutToken = () =>{
    const { cart } = props;
        if (cart.line_items.length) {
          console.log("getting token")
        return commerce.checkout.generateToken(cart.id, { type: 'cart' })
          .then((token) => {
            console.log("token", token)
            setCheckoutToken(token)
          })
          // .then(() => {
          //   console.log("checkoutToken", checkoutToken)
          //   fetchShippingCountries(checkoutToken.id)
          // })

          .catch((error) => {
            console.log('There was an error in generating a token', error);
          });
    }
  }

  // const getLiveInfo = () =>{
  //       if (checkoutToken) {
  //       return commerce.checkout.getLive(checkoutToken)
  //         .then((live) => {
  //           console.log("live", live)
  //           setLive(live)
  //         })
  //         .catch((error) => {
  //           console.log('There was an error in generating a token', error);
  //         });
  //   }
  // }

  const fetchShippingCountries = (checkoutTokenId) => {

    commerce.services.localeListShippingCountries(checkoutTokenId)
      .then((countries) => {
        console.log("countries", countries.countries)
        setShippingCountries(countries.countries)
        fetchSubdivisions(Object.keys(countries.countries))
      })
      //.then((countries) => fetchSubdivisions(Object.keys(countries.countries)))
      .catch((error) => {
      console.log('There was an error fetching a list of shipping countries', error);
    });
  }

  const fetchSubdivisions = (countryCode) => {
    console.log("code", countryCode.length)
    if (countryCode.length != 0) {
      commerce.services.localeListSubdivisions(countryCode).then((subdivisions) => {
          console.log("subdivisions", subdivisions.subdivisions)
          setShippingSubDivisions(subdivisions.subdivisions)
      }).catch((error) => {
          console.log('There was an error fetching the subdivisions', error);
      });
    }
  }

  const fetchShippingOptions = (checkoutTokenId, country, stateProvince = null) => {
    commerce.checkout.getShippingOptions(checkoutTokenId,
      {
        country: country,
        region: stateProvince
      }).then((options) => {
        const shippingOption = options[0] || null;
        console.log("options", options, allCountries)
        setShippingOptions(options)
        setShippingOption(shippingOption)
      }).catch((error) => {
        console.log('There was an error fetching the shipping methods', error);
    });
  }

  const sanitizedLineItems = (lineItems) => {
  return lineItems.reduce((data, lineItem) => {
    const item = data;
    let variantData = null;
    if (lineItem.selected_options.length) {
      variantData = {
        [lineItem.selected_options[0].group_id]: lineItem.selected_options[0].option_id,
      };
    }
    item[lineItem.id] = {
      quantity: lineItem.quantity,
      variants: variantData,
    };
  return item;
  }, {});
};

  const renderCheckoutForm = () => {

  return (
    <CheckoutForm
                  fetchShippingOptions={fetchShippingOptions}
                  fetchSubdivisions={fetchSubdivisions}
                  checkoutToken={checkoutToken}
                  sanitizedLineItems={sanitizedLineItems}
                  shippingOptions={options}
                  shippingCountries={allCountries}
                  shippingSubdivisions={subdivisions}
    //              live={live}
                  onCaptureCheckout={props.onCaptureCheckout}
                  fetchProduct={props.fetchProduct}
                  getCartContents={props.getCartContents}
                  cart={props.cart}
                  data={props.data}
                  productsHas={props.productsHas}
    />
  );
}

    const renderCheckoutSummary = () => {

        return (
            <>
                <div className="checkout summary">
                    <h4>Order summary</h4>
                    {Object.entries(props.cart).length == 0 ? <CircleSpinner size={30} loading={true} /> : null}
                        {Object.entries(props.cart).length !== 0 && props.cart.line_items.map((lineItem) => {
                          console.log("lineItem", lineItem)
                          return(
                            <>
                                <div key={lineItem.id} className="checkout summary-details">
                                    <img className="checkout summary-img" src={lineItem.image.url} alt={lineItem.name}/>
                                    <p className="checkout summary-name">{lineItem.quantity} x {lineItem.name}</p>
                                    <p className="checkout summary-value">{lineItem.line_total.formatted_with_symbol}</p>
                                    </div>
                            </>
                        )})}
                    <div className="checkout summary-total">
                        <p className="checkout summary-price">
                            <span>Subtotal:</span>
                            {Object.entries(props.cart).length !== 0 && props.cart.subtotal.formatted_with_symbol}
                        </p>
                    </div>
                </div>
            </>
        )
    }

    return (
      <>
      <div className="rn-post-list-page rn-section-gap bg-color-white">
          <div className="container">
            <div className="page-top">
                <h1 className="title_holder">Checkout</h1>
                <div className="breadcrumbs-area">
                    <ul className="breadcrumbs">
                        <li><a href="/">Home</a></li>
                        <li className="separator"><span></span></li>
                        <li className="active">Checkout</li>
                    </ul>
                </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                  {renderCheckoutForm()}
              </div>
              <div className="col-lg-6">
              {renderCheckoutSummary()}
              </div>
            </div>
          </div>
      </div>
      </>
    );
  };

  export const currencyData = graphql`
  query currencyDataQuery {
    allOpenExchangeRates {
      nodes {
        currency
        rate
      }
    }
  }
  `

export default Checkout;
