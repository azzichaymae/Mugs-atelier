import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  });

  const addToCart = (product, quantity) => {
   

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      let newCart;

      if (existing) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: parseInt(item.quantity) + parseInt(quantity) }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }

      // Log the new cart state immediately after updating
      
      return newCart;
    });
     toast.success("Product added successfully!");
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
  const clearCart = () => {
  
    setCart([]);
    localStorage.removeItem('cart');
    
  }

  const value = { cart, addToCart, updateQuantity ,removeFromCart, clearCart};

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
