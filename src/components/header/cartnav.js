import React, { useState } from "react"
import Cart from '../cart'
import { FaShoppingBag, FaTimes, FaTimesCircle } from "react-icons/fa";
import {TiTimesOutline} from 'react-icons/ti'
import { isMobile } from "react-device-detect";

const CartNav = (props) => {
//  const [isCartVisible, setCartVisible] = useState(false);
  let { cart, onRemoveFromCart, onUpdateCartQty, onEmptyCart, scroll, isCartVisible, setCartVisible, isOverlayOpen, setOverlay, onMenuToggleClick } = props

  const renderOpenButton = () => (
  <div>
    <div className={scroll ? "cartnav2 cart-btn-open" : "cartnav cart-btn-open"}>
      <FaShoppingBag size={28} style={{color: "white"}}/>
      {cart ? <span className="cartBadge">{cart.total_items}</span> : ''}
    </div>
  </div>
  );

  const renderCloseButton = () => (
    <div className={scroll ? "cartnav2 cart-btn--close" : "cartnav cart-btn--close"}>
      <FaTimesCircle size={28} style={{color: "white", margin: "5px"}}/>
    </div>
  );

  const showCart = () => {
    setCartVisible(!isCartVisible)
    if (isMobile && isOverlayOpen == false) {
      setOverlay(!isOverlayOpen)
      document.querySelector('.trigger-popup-menu').classList.toggle('overlay-wrapper-open');
      document.querySelector('.hambergur-menu').classList.toggle('hambergur-menu-open');
    }
  }


  return (
    <div className={scroll ? "cartnav2" : "cartnav"}>
      <div onClick={showCart}>
          { !isCartVisible ? renderOpenButton() : renderCloseButton() }
      </div>
      { isCartVisible &&
        <Cart
          cart={cart}
          onUpdateCartQty={onUpdateCartQty}
          onRemoveFromCart={onRemoveFromCart}
          onEmptyCart={onEmptyCart}
        />
      }
    </div>
  );
};

export default CartNav;
