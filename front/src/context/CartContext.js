import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook for using the cart
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product , quantity) => {
   
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: product.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: quantity }];
    });
  };
  const updateQuantity = (id, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  const removeFromCart = (id) => {
    if(window.confirm("Are you sure you want to remove this item from the cart?")){
     setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    }
    return null;
  };
  const value = { cart, addToCart, updateQuantity ,removeFromCart};

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
