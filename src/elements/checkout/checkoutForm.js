import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useForm } from "react-hook-form";
import { PaystackButton } from "react-paystack"
import { loadScript } from "@paypal/paypal-js";
import commerce from '../../lib/Commerce';
import { CircleSpinner } from "react-spinners-kit";

const CheckoutForm = ({
  data,
  firstName,
  lastName,
  email,
  shippingName,
  shippingStreet,
  shippingCity,
  shippingPostalZipCode,
  shippingCountries,
  shippingSubdivisions,
  shippingOption,
  shippingOptions,
  cardNum,
  expMonth,
  expYear,
  ccv,
  fetchSubdivisions,
  fetchShippingOptions,
  fetchProduct,
  checkoutToken,
  sanitizedLineItems,
  cart,
  productsHas,
//  live,
  onCaptureCheckout
}) => {
    const { register, handleSubmit, formState: { errors }  } = useForm({
		mode: "onBlur"
	})
    const [serverState, setServerState] = useState({
		submitting: false,
		status: null
    });

    const [loading, setLoading] = useState(true)
    const [cartItems, setItems] = useState([])
    const [isShipping, setShipping] = useState(false)
    let componentProps = {}
    let paypal;
    let shipHas = JSON.parse(sessionStorage.getItem("productHas"))
    console.log("LOCAL Storage", shipHas)

  useEffect(() => {
    if (Object.keys(cart).length !== 0  && Object.keys(checkoutToken).length !== 0) {
      console.log("SHIPPING?")
      if (shipHas.find(x => x.digital_delivery === false)) {
        console.log("there is shipping")
        setShipping(true)
      }
      console.log("there is NO shipping")
      handleCaptureCheckoutPayPal()
    }
  }, [checkoutToken])





	const [value, setValue] = useState({
    lastName: '',
    email: '',
    amount: '0.00',
    shippingName: '',
    shippingStreet: '',
    shippingCity: '',
    shippingPostalZipCode: '',
    shippingCountry: 'ZA',
    shippingSubdivision: 'GP',
    shippingOption: '',
    shippingOptions: [],
    shippingCountries: {},
    shippingSubdivisions: {},
    cardNum: '',
    expMonth: '',
    expYear: '',
    ccv: ''
    });

    const handleServerResponse = (ok, msg, form) => {
		setServerState({
			submitting: false,
			status: { ok, msg }
		});
		if (ok) {
			form.reset();
			setValue({
        lastName: '',
        email: '',
        amount: '0.00',
        shippingName: '',
        shippingStreet: '',
        shippingCity: '',
        shippingPostalZipCode: '',
        shippingCountry: '',
        shippingSubdivision: '',
        shippingOption: '',
        shippingOptions: [],
        shippingCountries: {},
        shippingSubdivisions: {},
        cardNum: '',
        expMonth: '',
        expYear: '',
        ccv: ''
			})
		}
    };

    useEffect(() => {
      if (Object.keys(cart).length !== 0  && Object.keys(checkoutToken).length !== 0) {
        console.log("SHIPPING?", shipHas)
        let shipping = shipHas.find(x => x.digital_delivery === false)
        console.log("SHIPPING?", shipping)
        if (productsHas.find(x => x.digital_delivery === false)) {
          console.log("there is shipping")
          setShipping(true)
        }
        console.log("there is NO shipping")
      }
    }, [value])


    const onSubmit = (data, e) => {
		// const form = e.target;
		// setServerState({ submitting: true });
		// axios({
		// 	method: "post",
		// 	url: url,
		// 	data
		// })
		// 	.then(res => {
		// 		handleServerResponse(true, "Thanks! for being with us", form);
		// 	})
		// 	.catch(err => {
		// 		handleServerResponse(false, err.response.data.error, form);
		// 	});
	}

  const isErrors = Object.keys(errors).length !== 0 && true;
	const onChangeHandler = e => {
		setValue({ ...value, [e.target.name]: e.target.value })
	}

  const handleShippingCountryChange = (e) => {
    const currentValue = e.target.value;
    setValue({ ...value, [e.target.name]: e.target.value })
    fetchSubdivisions(currentValue);
  };

  const handleSubdivisionChange = (e) => {
        const currentValue = e.target.value;
        setValue({ ...value, [e.target.name]: e.target.value })
        fetchShippingOptions(checkoutToken.id, value.shippingCountry, currentValue)
  }

  const handleShippingOptionChange = (e) => {
    const currentValue = e.target.value;
    setValue({ ...value, [e.target.name]: e.target.value })
  }

  const onSuccess = (reference) => {

    console.log("REF", reference)
    handleCaptureCheckout(reference)
  };

  const onClose = () => {
    console.log('closed')
  }

  const handleCaptureCheckout = (ref) => {
    console.log("In handle checkout")
    const orderData = {
      line_items: sanitizedLineItems(cart.line_items),
      customer: {
        firstname: value.firstName,
        lastname: value.lastName,
        email: value.email,
      },
      shipping: {
        name: value.firstName + " " + value.lastName,
        street: value.shippingStreet,
        town_city: value.shippingCity,
        county_state: value.shippingSubdivision,
        postal_zip_code: value.shippingPostalZipCode,
        country: value.shippingCountry,
      },
      fulfillment: {
        shipping_method: shippingOptions[0].id
      },
      payment: {
        id: 'gway_zoBZa8LavyNOoP', // live gway_Y5eDARaA6K49o3
        gateway: 'paystack',
        paystack: {
          reference: ref.reference
        },
        // card: {
        //   number: value.cardNum,
        //   expiry_month: value.expMonth,
        //   expiry_year: value.expYear,
        //   cvc: value.ccv,
        //   postal_zip_code: value.shippingPostalZipCode,
        // },
      },
      pay_what_you_want: '2222.00',
    };
    console.log(checkoutToken.id, "Order data", orderData)

    onCaptureCheckout(checkoutToken.id, orderData);
  };

  const handleCaptureCheckoutPayPal = async (ref) => {

    const orderData = {
      line_items: sanitizedLineItems(cart.line_items),
      customer: {
        firstname: value.firstName,
        lastname: value.lastName,
        email: value.email,
      },
      payment: {
        gateway: 'paypal',
        paypal: {
          action: 'authorize',
        },
      },
    };

    renderPaypalButton();
  }

  const renderPaypalButton = () => {

    const filterCurrency = data.allOpenExchangeRates.nodes.filter(curr=>curr.currency=="ZAR");
    let usdCurrency = parseFloat(cart.subtotal.raw) / filterCurrency[0].rate
    console.log("usd value", filterCurrency[0].rate, cart.subtotal.raw)

    loadScript({ "client-id": "AQgueuxjYVXkSyP6R47CpNuP8wsoy4sG2zjnQl0qZt1ZcsKOpVgE71ssvJ9nB970QE_OzVYFfdIwK0PT" })
    .then((paypal) => {
        paypal
            .Buttons({
              style: {
                layout: 'horizontal',
                color:  'gold',
                shape:  'pill',
                label:  'paypal'
              },
              createOrder: function(data, actions) {
                // Set up the transaction

                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: (usdCurrency.toFixed(2)).toString()
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  captureOrder(details)
                });
              }
            })
            .render("#paypalbutton")
            .catch((error) => {
                console.error("failed to render the PayPal Buttons", error);
            });
            setLoading(false)
    })
    .catch((error) => {
        console.error("failed to load the PayPal JS SDK script", error);
    });
}

const captureOrder = async (data) => {
  try {
    console.log("DATA", data)
    const order = await commerce.checkout.capture(checkoutToken.id, {
      customer: {
        firstname: data.payer.name.given_name,
        lastname: data.payer.name.surname,
        email: data.payer.email_address,
      },
      payment: {
        id: 'gway_9l6LJmxJE8Oyo1',
        gateway: 'paypal',
        paypal: {
          action: 'capture',
          payment_id: data.id,
          payer_id: data.payer.payer_id,
        },
      },
    })

    // If we get here, the order has been successfully captured and the order detail is part of the `order` variable
    console.log(order);
    return;
  } catch (response) {
    // There was an issue capturing the order with Commerce.js
    console.log(response);
    alert(response.message);
    return;
  } finally {
    // Any loading state can be removed here.
  }
}

  if (Object.entries(cart).length !== 0) { //&& Object.entries(live).length !== 0) {
    console.log("CART", shippingOptions)
    let total = parseFloat(cart.subtotal.raw)
    if(shippingOptions[0]) {
      total = total + parseFloat(shippingOptions[0].price.raw)
    }
    componentProps = {
      email: value.email,
      amount: total * 100 ,
      currency: "ZAR",
      publicKey: "pk_live_b10691dc007bf4e394d92f0ad75f996e327736c6",//"pk_test_4f0dddba5d054ad67f1c38a665e1fe95017a06a1",
      text: "Pay Now",
      onSuccess,
      onClose,
    }

  }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="col-lg-12">
              <div className="page-top">
                  <h5 className="title_holder">Customer Details</h5>
              </div>
          </div>

            <div className={`form-group ${(isErrors && errors.firstName) ? 'has-error' : ''} ${value.firstName ? 'has-value' : ''}`}>
                <input
                    type="text"
                    id="firstname"
                    value={firstName}
                    {...register('firstName', {
                      onChange: (e) => {onChangeHandler(e)},
                      required: 'First Name Required'
                    })}
                />
                <label htmlFor="name">First Name</label>
                {errors.firstName && <span className="error">{errors.firstName.message}</span>}
            </div>
            <div className={`form-group ${(isErrors && errors.lastName) ? 'has-error' : ''} ${value.lastName ? 'has-value' : ''}`}>
                <input
                    type="text"
                    id="lastname"
                    value={lastName}
                    {...register('lastName', {
                      onChange: (e) => {onChangeHandler(e)},
                      required: 'Last Name Required'
                    })}
                />
                <label htmlFor="name">Last Name</label>
                {errors.lastName && <span className="error">{errors.lastName.message}</span>}
            </div>

            <div className={`form-group ${(isErrors && errors.email) ? 'has-error' : ''} ${value.email ? 'has-value' : ''}`}>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    {...register('email', {
                      onChange: (e) => {onChangeHandler(e)},
                      required: 'Email Required',
                      pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "invalid email address"
                      }
                     })}
                />
                <label htmlFor="email">Enter Your Email</label>
                {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            {isShipping &&
              <>
              <div className="col-lg-12">
                <div className="page-top">
                    <h5 className="title_holder">Shipping Details</h5>
                </div>
            </div>

            <div className={`form-group ${(isErrors && errors.shippingStreet) ? 'has-error' : ''} ${value.shippingStreet ? 'has-value' : ''}`}>
              <input
                  type="text"
                  name="shippingStreet"
                  id="shippingStreet"
                  value={shippingStreet}
                  {...register('shippingStreet', {
                    onChange: (e) => {onChangeHandler(e)},
                    required: 'Shipping street Required',
                   })}
              />
                <label htmlFor="message">Street Address</label>
                {errors.shippingStreet && <span className="error">{errors.shippingStreet.message}</span>}
            </div>

            <div className={`form-group ${(isErrors && errors.shippingCity) ? 'has-error' : ''} ${value.shippingCity ? 'has-value' : ''}`}>
                <input
                    type="text"
                    name="shippingCity"
                    id="shippingCity"
                    value={shippingCity}
                    {...register('shippingCity', {
                      onChange: (e) => {onChangeHandler(e)},
                      required: 'City Required',
                     })}
                />
                <label htmlFor="subject">City</label>
                {errors.shippingCity && <span className="error">{errors.shippingCity.message}</span>}
            </div>

            <div className={`form-group ${(isErrors && errors.shippingPostalZipCode) ? 'has-error' : ''} ${value.shippingPostalZipCode ? 'has-value' : ''}`}>
                <input
                    type="text"
                    name="shippingPostalZipCode"
                    id="shippingPostalZipCode"
                    value={shippingPostalZipCode}
                    {...register('shippingPostalZipCode', {
                      onChange: (e) => {onChangeHandler(e)},
                      required: 'Zip Code Required',
                     })}
                />
                <label htmlFor="subject">Zip Code</label>
                {errors.shippingPostalZipCode && <span className="error">{errors.shippingPostalZipCode.message}</span>}
            </div>

            <div className="row" style={{marginBottom: "20px"}}>
              <div className="col-lg-4">
                <label htmlFor="subject">Country</label>
              </div>
              <div className="col-lg-8">
                <select
                  value={value.shippingCountry}
                  className="form-select"
                  style={{width: "50%", textAlign: "center", fontSize: "1.5rem"}}
                  name="shippingCountry"
                  id="shippingCountry"
                  onChange={handleShippingCountryChange}
                  >
                  <option disabled>Country</option>
                  {
                    Object.entries(shippingCountries).length !== 0  && Object.keys(shippingCountries).map((index) => {
                      return (
                        <option value={index} key={index}>{shippingCountries[index]}</option>
                      )
                    })
                  }
                  </select>
                </div>
            </div>

            <div className="row" style={{marginBottom: "20px"}}>
              <div className="col-lg-4">
                <label htmlFor="subject">State/Province</label>
              </div>
              <div className="col-lg-8">
                <select
                  value={value.shippingSubdivision}
                  className="form-select"
                  style={{width: "50%", textAlign: "center", fontSize: "1.5rem"}}
                  name="shippingSubdivision"
                  id="shippingSubdivision"
                  onChange={handleSubdivisionChange}
                  >
                  <option disabled>State/Province</option>
                  {
                    Object.entries(shippingSubdivisions).length !== 0 && Object.keys(shippingSubdivisions).map((index) => {
                      return (
                        <option value={index} key={index}>{shippingSubdivisions[index]}</option>
                      )
                    })
                  }
                  </select>
                </div>
            </div>

            <div className="row" style={{marginBottom: "20px"}}>
                <div className="col-lg-4">
                  <label htmlFor="subject">Shipping method</label>
                </div>
                <div className="col-lg-8">
                  <select
                    value={value.shippingOption}
                    name="shippingOption"
                    className="form-select"
                    style={{width: "50%", textAlign: "center", fontSize: "1.5rem"}}
                    id="shippingOption"
                    onChange={handleShippingOptionChange}
                    >
                    <option disabled>Select a shipping method</option>
                    {
                      Object.entries(shippingOptions).length !== 0 && shippingOptions.map((method, index) => {
                        return (
                          <option value={method.id} key={index}>{`${method.description} - ${method.price.formatted_with_code}` }</option>
                        )
                      })
                    }
                    </select>
                </div>
            </div>
            </>
          }


            <div className="form-submit">
              {Object.entries(cart).length == 0 ? <CircleSpinner size={30} loading={loading} /> : null}
              {Object.entries(componentProps).length !== 0 &&
                <div>
                  <PaystackButton className="rn-button" type="submit"
                    disabled={serverState.submitting}
                    {...componentProps}
                  />
                  <div id="paypalbutton" style={{marginTop: "10px"}}><CircleSpinner size={30} loading={loading} /></div>
                </div>
              }
                {serverState.status && (
                    <p className={`form-output ${!serverState.status.ok ? "errorMsg" : "success"}`}>
                        {serverState.status.msg}
                    </p>
                )}
            </div>
        </form>
    )
}



export default CheckoutForm;
