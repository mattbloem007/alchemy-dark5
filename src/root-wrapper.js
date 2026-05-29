import React, { useEffect, useState } from "react";
import Layout from "./components/layout";

const CART_STORAGE_KEY = "stripe_cart";

const formatPrice = (amount, currency = "ZAR") =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency
  }).format(amount);

const buildCart = (lineItems = []) => {
  const subtotalRaw = lineItems.reduce(
    (sum, item) => sum + Number(item.price.raw || 0) * Number(item.quantity || 0),
    0
  );
  const currency = lineItems[0]?.price?.currency || "ZAR";
  return {
    id: "local-cart",
    line_items: lineItems,
    total_items: lineItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    total_unique_items: lineItems.length,
    subtotal: {
      raw: subtotalRaw,
      formatted_with_symbol: formatPrice(subtotalRaw, currency)
    },
    currency: { code: currency }
  };
};

const Alchemy = (props) => {
  const [cart, setCart] = useState(buildCart([]));
  const [isCartVisible, setCartVisible] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [productsHas, setProductsHas] = useState([]);
  const [variants] = useState({ product: "", variant: {} });

  const saveCart = (nextLineItems) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextLineItems));
    }
    setCart(buildCart(nextLineItems));
  };

  const setCartVisibility = () => {
    setCartVisible(!isCartVisible);
  };

  const setOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const fetchProduct = () => {};

  const handleAddToCart = (product, quantity = 1) => {
    if (!product?.id) {
      return;
    }
    const existing = cart.line_items.find((item) => item.id === product.id);
    let nextLineItems;
    if (existing) {
      nextLineItems = cart.line_items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      nextLineItems = [
        ...cart.line_items,
        {
          id: product.id,
          product_id: product.id,
          name: product.name,
          metadata: product.metadata || {},
          image: { url: product.images?.[0] || "" },
          quantity,
          has: {
            digital_delivery: product.metadata?.digital_delivery !== "false",
            physical_delivery: product.metadata?.digital_delivery === "false"
          },
          price: {
            raw: Number(product.price?.raw || 0),
            currency: product.price?.currency || "ZAR",
            formatted_with_symbol: product.price?.formatted_with_symbol || formatPrice(0)
          }
        }
      ];
    }
    saveCart(
      nextLineItems.map((item) => ({
        ...item,
        line_total: {
          raw: Number(item.price.raw) * Number(item.quantity),
          formatted_with_symbol: formatPrice(
            Number(item.price.raw) * Number(item.quantity),
            item.price.currency
          )
        }
      }))
    );
  };

  const handleUpdateCartQty = (lineItemId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(lineItemId);
      return;
    }
    const nextLineItems = cart.line_items.map((item) =>
      item.id === lineItemId ? { ...item, quantity } : item
    );
    saveCart(
      nextLineItems.map((item) => ({
        ...item,
        line_total: {
          raw: Number(item.price.raw) * Number(item.quantity),
          formatted_with_symbol: formatPrice(
            Number(item.price.raw) * Number(item.quantity),
            item.price.currency
          )
        }
      }))
    );
  };

  const handleRemoveFromCart = (lineItemId) => {
    const nextLineItems = cart.line_items.filter((item) => item.id !== lineItemId);
    saveCart(nextLineItems);
  };

  const handleEmptyCart = () => {
    saveCart([]);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("productHas");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const saved = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    const hydrated = saved.map((item) => ({
      ...item,
      line_total: {
        raw: Number(item.price.raw) * Number(item.quantity),
        formatted_with_symbol: formatPrice(
          Number(item.price.raw) * Number(item.quantity),
          item.price.currency
        )
      }
    }));
    setCart(buildCart(hydrated));
    setProductsHas(
      hydrated.map((item) => ({
        digital_delivery: item.has?.digital_delivery !== false,
        physical_delivery: item.has?.physical_delivery === true
      }))
    );
  }, []);

  useEffect(() => {
    setProductsHas(
      (cart.line_items || []).map((item) => ({
        digital_delivery: item.has?.digital_delivery !== false,
        physical_delivery: item.has?.physical_delivery === true
      }))
    );
  }, [cart]);

  const elementWithProps = React.Children.map(props.element, (child, i) =>
    React.cloneElement(child, {
      cart: cart,
      onAddToCart: handleAddToCart,
      onUpdateCartQty: handleUpdateCartQty,
      onRemoveFromCart: handleRemoveFromCart,
      onEmptyCart: handleEmptyCart,
      fetchProduct: fetchProduct,
      isCartVisible: isCartVisible,
      setCartVisible: setCartVisibility,
      isOverlayOpen: isOverlayOpen,
      setOverlay: setOverlay,
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
  );
};

export default Alchemy;
