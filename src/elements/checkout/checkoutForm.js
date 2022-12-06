import React, { useState } from 'react';
import axios from 'axios'
import { useForm } from "react-hook-form";
import { PaystackButton } from "react-paystack"

const CheckoutForm = ({firstName,
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
  checkoutToken,
  sanitizedLineItems,
  cart,
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

  let componentProps = {}

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
    console.log("value", value)

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
    // Implementation for whatever you want to do with reference and after success call.
    console.log("REF", reference)
    handleCaptureCheckout(reference)
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed')
  }

  const handleCaptureCheckout = (ref) => {

    const orderData = {
      line_items: sanitizedLineItems(cart.line_items),
      customer: {
        firstname: value.firstName,
        lastname: value.lastName,
        email: value.email,
      },
      // shipping: {
      //   name: value.shippingName,
      //   street: value.shippingStreet,
      //   town_city: value.shippingCity,
      //   county_state: value.shippingSubdivision,
      //   postal_zip_code: value.shippingPostalZipCode,
      //   country: value.shippingCountry,
      // },
      // fulfillment: {
      //   shipping_method: shippingOptions[0].id
      // },
      payment: {
        id: 'gway_Y5eDARaA6K49o3',
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
    console.log("Order data", orderData)

    onCaptureCheckout(checkoutToken.id, orderData);
  };

  if (Object.entries(cart).length !== 0) { //&& Object.entries(live).length !== 0) {
    componentProps = {
      email: value.email,
      amount: parseFloat(cart.subtotal.raw) * 100,
      currency: "ZAR",
      publicKey: "pk_live_b10691dc007bf4e394d92f0ad75f996e327736c6",
      text: "Pay Now",
      onSuccess,
      onClose,
    }
  }


    return (
        <form onSubmit={() => handleSubmit(onSubmit)}>

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


            {/**<div className="col-lg-12">
                <div className="page-top">
                    <h5 className="title_holder">Shipping Details</h5>
                </div>
            </div>

            <div className={`form-group ${(isErrors && errors.shippingName) ? 'has-error' : ''} ${value.shippingName ? 'has-value' : ''}`}>
                <input
                    type="text"
                    name="shippingName"
                    id="shippingName"
                    value={shippingName}
                    onChange={onChangeHandler}
                    ref={register({
                        required: 'Full Name Required',
                    })}
                />
                <label htmlFor="subject">Full Name</label>
                {errors.shippingName && <span className="error">{errors.shippingName.message}</span>}
            </div>

            <div className={`form-group ${(isErrors && errors.shippingStreet) ? 'has-error' : ''} ${value.shippingStreet ? 'has-value' : ''}`}>
              <input
                  type="text"
                  name="shippingStreet"
                  id="shippingStreet"
                  value={shippingStreet}
                  onChange={onChangeHandler}
                  ref={register({
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
                    onChange={onChangeHandler}
                    ref={register({
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
                    onChange={onChangeHandler}
                    ref={register({
                        required: 'City Required',
                    })}
                />
                <label htmlFor="subject">Postal/Zip Code</label>
                {errors.shippingPostalZipCode && <span className="error">{errors.shippingPostalZipCode.message}</span>}
            </div>

            <div className="row">
              <div className="col-lg-2">
                <label htmlFor="subject">Country</label>
              </div>
              <div className="col-lg-8">
                <select
                  value={value.shippingCountry}
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
                  };
                  </select>
                </div>
            </div>

            <div className="row">
              <div className="col-lg-2">
                <label htmlFor="subject">State/Province</label>
              </div>
              <div className="col-lg-8">
                <select
                  value={value.shippingSubdivision}
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
                  };
                  </select>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-2">
                  <label htmlFor="subject">Shipping method</label>
                </div>
                <div className="col-lg-8">
                  <select
                    value={value.shippingOption}
                    name="shippingOption"
                    id="shippingOption"
                    onChange={handleShippingOptionChange}
                    >
                    <option disabled>Select a shipping method</option>
                    {
                      Object.entries(shippingOptions).length !== 0 && shippingOptions.map((method, index) => {
                        return (
                          <option value={method.id} key={index}>{`${method.description} - $${method.price.formatted_with_code}` }</option>
                        )
                      })
                    };
                    </select>
                </div>
            </div>

            <div className="col-lg-12" style={{marginTop: "50px"}}>
                <div className="page-top">
                    <h5 className="title_holder">Payment Details</h5>
                </div>
            </div>

            <div className={`form-group ${(isErrors && errors.cardNum) ? 'has-error' : ''} ${value.cardNum ? 'has-value' : ''}`}>
                <input
                    type="text"
                    name="cardNum"
                    id="cardNum"
                    value={cardNum}
                    onChange={onChangeHandler}
                    ref={register({
                        required: 'Card number Required',
                    })}
                />
                <label htmlFor="subject">Credit card number</label>
                {errors.cardNum && <span className="error">{errors.cardNum.message}</span>}
            </div>

            <div className={`form-group ${(isErrors && errors.expMonth) ? 'has-error' : ''} ${value.expMonth ? 'has-value' : ''}`}>
                <input
                    type="text"
                    name="expMonth"
                    id="expMonth"
                    value={expMonth}
                    onChange={onChangeHandler}
                    ref={register({
                        required: 'Expiry month Required',
                    })}
                />
                <label htmlFor="subject">Expiry month</label>
                {errors.expMonth && <span className="error">{errors.expMonth.message}</span>}
            </div>

            <div className={`form-group ${(isErrors && errors.expYear) ? 'has-error' : ''} ${value.expYear ? 'has-value' : ''}`}>
                <input
                    type="text"
                    name="expYear"
                    id="expYear"
                    value={expYear}
                    onChange={onChangeHandler}
                    ref={register({
                        required: 'Expiry year Required',
                    })}
                />
                <label htmlFor="subject">Expiry Year</label>
                {errors.expYear && <span className="error">{errors.expYear.message}</span>}
            </div>

            <div className={`form-group ${(isErrors && errors.ccv) ? 'has-error' : ''} ${value.ccv ? 'has-value' : ''}`}>
                <input
                    type="text"
                    name="ccv"
                    id="ccv"
                    value={ccv}
                    onChange={onChangeHandler}
                    ref={register({
                        required: 'CCV Required',
                    })}
                />
                <label htmlFor="subject">CCV</label>
                {errors.ccv && <span className="error">{errors.ccv.message}</span>}
            </div>*/}

            <div className="form-submit">
              {Object.entries(componentProps).length !== 0 && <PaystackButton className="rn-button" type="submit"
                disabled={serverState.submitting}
                {...componentProps}
                />}
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
