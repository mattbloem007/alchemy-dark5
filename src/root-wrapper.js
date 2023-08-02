import React, {useEffect, useState } from 'react'
import Layout from './components/layout'
import commerce from './lib/Commerce';
import { navigate } from "gatsby"


const Alchemy = (props) => {
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [variants, setVariants] = useState({product: "", variant: {}})
  const [isCartVisible, setCartVisible] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [productsHas, setProductsHas] = useState([]);

//  const [product, setProduct] = useState({});
  console.log("PROPS", props)
  const fetchCart = () => {
  commerce.cart.retrieve().then((cart) => {
      setCart(cart);
    }).catch((error) => {
      console.log('There was an error fetching the cart', error);
    });
  }

  const fetchVariants = (productId) => {
  commerce.products.getVariants(productId).then((variant) => {
      setVariants({product: productId, variant: variant});
      console.log("Variants: ", variant)
    }).catch((error) => {
      console.log('There was an error fetching the variants', error);
    });
  }

  const setCartVisibility = () => {
    setCartVisible(!isCartVisible)
  }

  const setOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen)
  }

  const returnProduct = (product) => {
    console.log("returned", product)
    return product;
  }

  const fetchProduct = (productId) => {
    commerce.products.retrieve(productId)
    .then(product => setProductsHas(product.has))
  }


  const handleAddToCart = (has, productId, quantity, variantID) => {
    commerce.cart.add(productId, quantity, variantID).then((item) => {
      console.log("cart", item)
      setProductsHas([...productsHas, has])
      let existingHas = JSON.parse(sessionStorage.getItem("productHas"))
      if (existingHas == null) {
        existingHas = []
      }
      existingHas.push(has)
      sessionStorage.setItem("productHas", JSON.stringify(existingHas))
      setCart(item);
    }).catch((error) => {
      console.error('There was an error adding the item to the cart', error);
    });
  }

  const handleUpdateCartQty = (lineItemId, quantity) => {
    commerce.cart.update(lineItemId, { quantity }).then((resp) => {
      setCart(resp);
    }).catch((error) => {
      console.log('There was an error updating the cart items', error);
    });
  }

  const handleRemoveFromCart = (lineItemId) => {
    commerce.cart.remove(lineItemId).then((resp) => {
      setCart(resp);
    }).catch((error) => {
      console.error('There was an error removing the item from the cart', error);
    });
  }

  const handleEmptyCart = () => {
    sessionStorage.clear();
    commerce.cart.empty().then((resp) => {
      setCart(resp);
    }).catch((error) => {
      console.error('There was an error emptying the cart', error);
    });
  }

  const refreshCart = () => {
    commerce.cart.refresh().then((newCart) => {
      setCart(newCart);
    }).catch((error) => {
      console.log('There was an error refreshing your cart', error);
    });
  };

  const handleCaptureCheckout = (checkoutTokenId, newOrder) => {
    console.log("NEW ORDER", newOrder, checkoutTokenId)
    commerce.checkout.capture(checkoutTokenId, newOrder).then((ord) => {
      // Save the order into state
      console.log("ORDER", ord)
      setOrder(ord);
      // Clear the cart
      refreshCart();
      // Send the user to the receipt
      navigate('/confirmation');
      // Store the order in session storage so we can show it again if the
      // user refreshes the page!
      typeof window !== 'undefined' && window.sessionStorage.setItem('order_receipt', JSON.stringify(ord));
    }).catch((error) => {
      console.log('There was an error confirming your order', error);
    });
  };

  // useEffect(() => {
  // //  fetchProducts();
  //   fetchCart();
  // }, []);

  useEffect(() => {
    let isMounted = true;
    commerce.cart.retrieve().then((cart) => {
        if (isMounted) setCart(cart);
      }).catch((error) => {
        console.log('There was an error fetching the cart', error);
      });               // note mutable flag

    return () => { isMounted = false }; // cleanup toggles value, if unmounted
  }, []);

  const elementWithProps = React.Children.map(props.element, (child, i) =>
    React.cloneElement(child, {
      cart: cart,
      onAddToCart: handleAddToCart,
      onUpdateCartQty: handleUpdateCartQty,
      onRemoveFromCart: handleRemoveFromCart,
      onEmptyCart: handleEmptyCart,
      onCaptureCheckout: handleCaptureCheckout,
      fetchProduct: fetchProduct,
      isCartVisible: isCartVisible,
      setCartVisible: setCartVisibility,
      isOverlayOpen: isOverlayOpen,
      setOverlay: setOverlay,
      onFetchVariants: fetchVariants,
      variants: variants,
      productsHas: productsHas
    })
  );

  return (
      <div>
        <Layout
          cart={cart}
          productsHas={productsHas}
          onUpdateCartQty={handleUpdateCartQty}
          onRemoveFromCart={handleRemoveFromCart}
          onEmptyCart={handleEmptyCart}
          fetchProduct={fetchProduct}
          isCartVisible={isCartVisible}
          setCartVisible={setCartVisibility}
          isOverlayOpen={isOverlayOpen}
          setOverlay={setOverlay}
          >
          {elementWithProps}
        </Layout>
      </div>
  )
}

export default Alchemy
