import React, { createContext, useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
const CartContext = createContext();

// Custom hook for using the cart
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  });
  const [quantity, setQuantity] = useState(0);

  const returnQuantity = (id) => {
  const item = cart.find((item) => item.id === id);
  return item ? item.quantity : 0;
};


  const addToCart = (product, quantity) => {
    const availableStock = product.stock - parseInt(returnQuantity(product.id));
    if (product.stock < parseInt(quantity) + parseInt(returnQuantity(product.id)   )) {
      toast.error(`Not enough stock available,${availableStock!== 0 ? "only" : ""} ${availableStock} left !`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return false;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      let newCart;

      if (existing) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: parseInt(item.quantity) + parseInt(quantity),
              }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }

      // Log the new cart state immediately after updating

      return newCart;
    });
    
    toast.success("Product added successfully!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
    });
    return true;
  };
  const updateQuantity = (id, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  const removeFromCart = (id) => {
    Swal.fire({
            
            text: 'Are you sure you want to remove this item from the cart ?',
            icon: 'warning',
            width: '300px',  
            padding: '0.8rem',
            showCancelButton: true,
           
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'btn btn-md  btn-success',
                cancelButton: 'btn btn-md btn-secondary',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                 setCart((prevCart) => prevCart.filter((item) => item.id !== id));
            }
        });
    
  };
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const value = { cart, addToCart, updateQuantity, removeFromCart, clearCart , returnQuantity };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
