import React from 'react';
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/layout";
import CartItem from "../components/cartItem"
import Calltoaction from '../elements/calltoaction/calltoaction'


const Cart = (props) => {
  let { cart, onUpdateCartQty, onEmptyCart, onRemoveFromCart} = props

  const handleUpdateCartQty = (lineItemId, quantity) => {
    onUpdateCartQty(lineItemId, quantity);
  }

  const handleEmptyCart = () => {
    onEmptyCart();
  }

  const renderEmptyMessage = () => {
    if (cart) {
      if (cart.total_unique_items > 0) {
        return;
      }

      return (
        <p>
          You have no items in your shopping cart, start adding some!
        </p>
      );
    } else {
      return(<div></div>)
    }

  }

  const renderItems = () => {
    if (cart) {
      return(
        cart.line_items.map((lineItem) => (
          <CartItem
            item={lineItem}
            key={lineItem.id}
            className="cart inner"
            cart={cart}
            onUpdateCartQty={onUpdateCartQty}
            onRemoveFromCart={onRemoveFromCart}
            onEmptyCart={onEmptyCart}
          />
        ))
      );
    }
    else {
      return(<div></div>)
    }

  }
  const renderTotal = () => {
    if (cart) {
      return(
        <div className="row" style={{justifyContent: "space-between"}}>
          <p>Subtotal:</p>
          <p style={{fontWeight: "bold"}}>{cart.subtotal.formatted_with_symbol}</p>
        </div>
      );
    }
    else {
      return(<div></div>)
    }

  }
    return (
      <div className="cartContainer" style={{background: "#000000", paddingTop: "20px", borderRadius: "20px"}}>
          <div className="col-lg-12">
              <div className="page-top">
                  <h1 className="title_holder">Your Shopping Cart</h1>
              </div>
          </div>
          { renderEmptyMessage() }
          { renderItems() }

          <div className="col-lg-12" style={{justifyContent: "space-between"}}>
            { renderTotal() }
            <div className="row cartButtonContainer">
              <Calltoaction title="" buttonText="Empty Cart" action={handleEmptyCart} />
              <a href="/checkout"><Calltoaction title="" buttonText="Checkout"  /></a>
            </div>
          </div>
      </div>

    )
}
export default Cart;
