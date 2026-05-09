import React, { useEffect } from "react";


const Confirmation = (props) => {
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        const params = new URLSearchParams(window.location.search);
        if (params.get("checkout") === "success" && typeof props.onEmptyCart === "function") {
            props.onEmptyCart();
        }
    }, [props]);

    return (
        <>
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
                <div className="error-page-wrapper" style={{padding: "0px", minHeight: "49vh"}}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="inner">
                                    <h1 className="theme-color">Payment Confirmed</h1>
                                    <h4>Thank you for your purchase.</h4>
                                    <p>Your payment was processed through Stripe and your cart has been cleared.</p>
                                    <p>Please check your email for the Stripe receipt and any delivery details.</p>
                                    <br/>
                                    <br/>
                                    <a className="rn-button" href="/">Go Back</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Confirmation;
