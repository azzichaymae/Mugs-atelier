import React from "react";
// import "./Cart.css";
import { useCart } from "../../context/CartContext";

import { ShoppingCart, Minus, Plus, Trash } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart } = useCart();
  const { updateQuantity } = useCart();
  const { removeFromCart } = useCart();
  const cartItems = cart.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    category: item.category,
    description: item.description,
  }));
  const totalItems = cart.length;
  const isCartEmpty = cartItems.length === 0;

  const subtotal = cartItems
    .map((item) => item.price * item.quantity)
    .reduce((a, b) => a + b, 0);
  const shipping = 10.0;
  const total = subtotal + shipping;
  const changeQuantity = (operation, item) => {
    if (operation === "-") {
      return () => {
        if (item.quantity > 1) {
          updateQuantity(item.id, item.quantity - 1);
        } else {
          if (
            window.confirm(
              "Are you sure you want to remove this item from the cart?"
            )
          ) {
            removeFromCart(item.id);
          } else {
            return null;
          }
        }
      };
    } else if (operation === "+") {
      return () => {
        updateQuantity(item.id, item.quantity + 1);
      };
    }
  };

  return (
    <div class=" min-h-screen p-6">
      <nav class="flex space-x-6 text-sm font-normal text-gray-500 mb-6">
        <Link to="/" class="hover:text-gray-700 m-0 p-0">
          <i class="fa fa-solid fa-house"></i>{" "}
        </Link>
        <span class="text-gray-400 mx-1">/</span>
        <Link to="/shop" class="hover:text-gray-700 m-0 p-0">
          {" "}
          Shop
        </Link>
        <span class="text-gray-400 mx-1">/</span>
        <Link to={`/cart`} class="hover:text-gray-700 m-0 p-0">
          Shopping Cart
        </Link>
      </nav>
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-6">
          <div class="bg-white rounded-lg border border-transparent shadow-sm flex-1 p-6 max-w-4xl">
            {isCartEmpty ? (
              <div class="flex flex-col items-center justify-center h-full">
                <img
                  alt="Empty cart illustration"
                  class="w-32 h-32 mb-4"
                  src="abandoned-cart.png"
                />
                <h2 class="text-lg font-semibold text-[#1a1a1a] mb-2">
                  Your cart is empty
                </h2>
                <p
                  class="text-gray-
                    600 mb-4"
                >
                  Add some products to your cart to get started.
                </p>
                <Link
                  to="/shop"
                  class="bg-[#8B6F47] text-white py-2 px-4 rounded-md hover:bg-[#eab676] transition"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
               
              cartItems.map((item) => (
                <div className="d-flex justify-between items-center border-b border-gray-200 py-4">
                  <div class="flex items-center gap-6 w-2/3">
                    <img
                      src={`http://127.0.0.1:8000${item.image}`}
                      alt={item.name}
                      class="rounded-md"
                      style={{ height: "100px" }}
                    />

                    
                    <div class="flex flex-col gap-1">
                      <span class="text-gray-700 text-sm">{item.name}</span>
                      <span class="text-gray-500 text-xs">
                        ${item.price.toFixed(2)} each
                      </span>

                      <div class="flex items-center gap-3 mt-2">
                        <button
                          aria-label="Decrease quantity"
                          onClick={changeQuantity("-", item)}
                          class="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-900 text-lg leading-none"
                        >
                          −
                        </button>
                        <span
                          value={item.quantity}
                          min="1"
                          class="px-2 py-1 text-center w-12"
                        >
                          {item.quantity}
                        </span>
                        <button
                          aria-label="increase quantity"
                          onClick={changeQuantity("+", item)}
                          class="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-900 text-lg leading-none"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-4 ">
                    <span class="text-brown-400 font-semibold text-sm">
                      {item.price * item.quantity} USD
                    </span>
                    <button onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                      class="text-red-500 text-lg"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <aside class="bg-white rounded-lg border border-transparent shadow-sm p-6 w-full max-w-sm">
            <h2 class="font-semibold text-[#1a1a1a] mb-4">Order Summary</h2>
            <div class="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div class="flex justify-between text-gray-600 mb-4">
              <span>Shipping</span>
              <span>$10.00</span>
            </div>
            <hr class="border-gray-200 mb-4" />
            <div class="flex justify-between font-semibold text-[#1a1a1a] mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button class="w-full bg-[#8B6F47] text-white py-3 rounded-md text-center text-sm font-normal hover:bg-[#D4C7B0] transition">
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
