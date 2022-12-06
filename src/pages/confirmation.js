import React from 'react';
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/layout";
import { FaShoppingBag, } from "react-icons/fa";


const Confirmation = (props, {data}) => {

    let orderReceipt = typeof window !== 'undefined' && window.sessionStorage.getItem('order_receipt')
    let order = orderReceipt ? JSON.parse(orderReceipt) : {}
    console.log("order", order)
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
                                    <h1 className="theme-color">Order Confirmed</h1>
                                    <h4>Thank you for your purchase, {order.customer && order.customer.firstname} {order.customer && order.customer.lastname}!</h4>
                                    <span>Order ref:</span> {order.customer_reference && order.customer_reference}
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
