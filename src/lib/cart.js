import React, { useState, useEffect } from "react"
import commerce from './commerce';
const CartContext = React.createContext()

const CartProvider = ({children}) => {
  const [cart, setCart] = useState([])

  const fetchCart = () => {
  commerce.cart.retrieve().then((cart) => {
      setCart(cart);
    }).catch((error) => {
      console.log('There was an error fetching the cart', error);
    });
  }

  const handleAddToCart = (productId, quantity) => {
    commerce.cart.add(productId, quantity).then((item) => {
      setCart(item.cart);
    }).catch((error) => {
      console.error('There was an error adding the item to the cart', error);
    });
  }

  useEffect(() => {
  //  fetchProducts();
    fetchCart();
  }, []);

  const childrenWithProps = React.Children.map(children, (child, i) =>
    React.cloneElement(child, { float: true })
  );
  console.log("children with props", childrenWithProps)
  return (
    <CartContext.Provider value={[cart, setCart]}>
      {childrenWithProps}
    </CartContext.Provider>
  )
}

export { CartContext, CartProvider }
