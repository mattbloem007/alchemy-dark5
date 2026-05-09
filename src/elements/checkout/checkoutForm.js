import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { loadStripe } from "@stripe/stripe-js";
import { CircleSpinner } from "react-spinners-kit";

const CheckoutForm = ({
  shippingCountries,
  shippingSubdivisions,
  shippingOptions,
  fetchSubdivisions,
  fetchShippingOptions,
  checkoutToken,
  cart,
  productsHas
}) => {
  const parseJsonResponse = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(`Unexpected response from checkout endpoint (${response.status}).`);
    }
  };

  const createCheckoutSession = async (body) => {
    const endpoints = [
      "/.netlify/functions/create-stripe-checkout-session",
      "/api/create-stripe-checkout-session"
    ];
    let lastError = null;
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const payload = await parseJsonResponse(response);
        if (!response.ok || !payload.id) {
          throw new Error(payload.error || "Could not create Stripe checkout session.");
        }
        return payload;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("Could not create Stripe checkout session.");
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onBlur"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [value, setValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    shippingStreet: "",
    shippingCity: "",
    shippingPostalZipCode: "",
    shippingCountry: "ZA",
    shippingSubdivision: "GP",
    shippingOption: ""
  });

  const stripePromise = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    if (!process.env.GATSBY_STRIPE_PUBLISHABLE_KEY) {
      return null;
    }
    return loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY);
  }, []);

  const isShipping = useMemo(() => {
    return Array.isArray(productsHas) && productsHas.some((item) => item?.digital_delivery === false);
  }, [productsHas]);

  const isErrors = Object.keys(errors).length !== 0;

  const onChangeHandler = (event) => {
    setValue({ ...value, [event.target.name]: event.target.value });
  };

  const handleShippingCountryChange = (event) => {
    const currentValue = event.target.value;
    setValue({ ...value, [event.target.name]: event.target.value });
    fetchSubdivisions(currentValue);
  };

  const handleSubdivisionChange = (event) => {
    const currentValue = event.target.value;
    setValue({ ...value, [event.target.name]: event.target.value });
    fetchShippingOptions(checkoutToken.id, value.shippingCountry, currentValue);
  };

  const handleShippingOptionChange = (event) => {
    setValue({ ...value, shippingOption: event.target.value });
  };

  const onSubmit = async () => {
    if (!stripePromise) {
      setSubmitError("Stripe is not configured. Add GATSBY_STRIPE_PUBLISHABLE_KEY.");
      return;
    }
    if (!cart?.line_items?.length) {
      setSubmitError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const selectedShippingOption = value.shippingOption
        ? JSON.parse(value.shippingOption)
        : null;

      // Extract course info from first cart item's metadata
      const firstItem = cart.line_items[0];
      const courseId = firstItem?.metadata?.courseId || "";
      const automationId = firstItem?.metadata?.automationId || "";

      const origin = window.location.origin;
      const payload = await createCheckoutSession({
        cart,
        customer: {
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email
        },
        courseId,
        automationId,
        shippingAddress: isShipping
          ? {
              street: value.shippingStreet,
              city: value.shippingCity,
              postalCode: value.shippingPostalZipCode,
              subdivision: value.shippingSubdivision,
              country: value.shippingCountry
            }
          : null,
        shippingOption: selectedShippingOption,
        successUrl: `${origin}/confirmation?checkout=success`,
        cancelUrl: `${origin}/checkout?checkout=cancelled`
      });

      // Use client-side redirect to Stripe Checkout session
      // redirectToCheckout is no longer supported in newer versions of Stripe.js
      if (payload.url) {
        window.location.href = payload.url;
      } else {
        throw new Error("No checkout URL provided by server.");
      }
    } catch (error) {
      setSubmitError(error.message || "Something went wrong while redirecting to Stripe.");
      setIsSubmitting(false);
    }
  };

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
                    value={value.firstName}
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
                    value={value.lastName}
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
                    value={value.email}
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
                    value={value.shippingStreet}
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
                    value={value.shippingCity}
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
                    value={value.shippingPostalZipCode}
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
                    <option>Select a shipping method</option>
                    {
                      Object.entries(shippingOptions).length !== 0 && shippingOptions.map((method, index) => {
                        return (
                          <option value={JSON.stringify(method)} key={index}>{`${method.description} - ${method.price.formatted_with_code}` }</option>
                        )
                      })
                    }
                    </select>
                </div>
            </div>
            </>
          }


            <div className="form-submit">
              {Object.entries(cart).length === 0 ? <CircleSpinner size={30} loading={true} /> : null}
              {Object.entries(cart).length !== 0 && (
                <button className="rn-button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Redirecting to Stripe..." : "Continue to Stripe Checkout"}
                </button>
              )}
              {submitError && <p className="form-output errorMsg">{submitError}</p>}
            </div>
        </form>
    );
};

export default CheckoutForm;
