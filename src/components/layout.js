import React from "react";
import PropTypes from "prop-types";
import Header from "../components/header/header";
//import Client from "./client";
import HeaderSidebar from "../components/header/headerSidebar";
import Footer from "../components/footer/footer";
import '../scss/style.scss';

const Layout = (props) => {
  console.log(";ayout props", props)
  let {
    children,
    cart,
    onUpdateCartQty,
    onRemoveFromCart,
    onEmptyCart,
    isCartVisible,
    setCartVisible,
    isOverlayOpen,
    setOverlay
  } = props
  return (
    <div className="main-wrapper active-dark">
        <Header
        cart={cart}
        onUpdateCartQty={onUpdateCartQty}
        onRemoveFromCart={onRemoveFromCart}
        onEmptyCart={onEmptyCart}
        isCartVisible={isCartVisible}
        setCartVisible={setCartVisible}
        />
        <HeaderSidebar
        cart={cart}
        onUpdateCartQty={onUpdateCartQty}
        onRemoveFromCart={onRemoveFromCart}
        onEmptyCart={onEmptyCart}
        isCartVisible={isCartVisible}
        setCartVisible={setCartVisible}
        isOverlayOpen={isOverlayOpen}
        setOverlay={setOverlay}
        />
        <main>{children}</main>
        <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
