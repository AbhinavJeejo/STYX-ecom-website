import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const cartKey = user ? `cart_${user.id}` : "cart_guest";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(stored);
  }, [cartKey]);

  const saveCart = (updated) => {
    setCart(updated);
    localStorage.setItem(cartKey, JSON.stringify(updated));
  };

  const addToCart = (product, quantity = 1) => {
    const index = cart.findIndex(i => i.id === product.id);
    let updated = [];

    if (index !== -1) {
      updated = cart.map(i =>
        i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      updated = [...cart, { ...product, quantity }];
    }

    saveCart(updated);
  };

  const removeFromCart = (id) => {
    saveCart(cart.filter(i => i.id !== id));
  };

  const increaseQuantity = (id) => {
    saveCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const decreaseQuantity = (id) => {
    saveCart(
      cart.map(i =>
        i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(cartKey);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
