import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [action, setAction] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const cartItems = cart.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    stock : item.stock
  }));
  const subtotal = cartItems
    .map((item) => item.price * item.quantity)
    .reduce((a, b) => a + b, 0);
  const shipping = 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveAddress: false,
  });
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      if (window.confirm("Please log in to complete your checkout.")) {
        navigate("/login?redirect=/checkout");
      }
      return;
    }

    const fetchUserById = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/find/${userId}/`);
        const data = await response.json();
        setFormData((prevFormData) => ({
          ...prevFormData,
          firstName: data.name.split(" ")[0],
          lastName: data.name.split(" ")[1],
          email: data.email || "",
          phone: data.phone_number || "",
        }));
      } catch (error) {
        toast.error("Failed to fetch user data. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/user/${userId}/addresses/`
        );
        const data = await response.json();
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddressId(data[0].id);
          setFormData((prevFormData) => ({
            ...prevFormData,
            street: data[0].street || "",
            city: data[0].city,
            postalCode: data[0].postal_code,
            country: data[0].country,
          }));
        }
      } catch (error) {
        toast.error("Failed to load addresses.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    };

    const fetchData = async () => {
      await fetchUserById();
      await fetchAddresses();
    };

    fetchData();
  }, [userId, navigate]);

  // Validate a single field for real-time validation
  const validateField = (name, value) => {
    if (action !== "payment") return "";
    switch (name) {
      case "cardNumber":
        return !value || !/^\d{16}$/.test(value)
          ? "Valid 16-digit card number is required"
          : "";
      case "expiryDate":
        return !value || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)
          ? "Valid expiry date (MM/YY) is required"
          : "";
      case "cvv":
        return !value || !/^\d{3,4}$/.test(value)
          ? "Valid CVV (3-4 digits) is required"
          : "";
      default:
        return "";
    }
  };

  // Validate form data for submission
  const validateForm = () => {
    const newErrors = {};
    if (action === "info") {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Valid email is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.street) newErrors.street = "Street address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.postalCode) newErrors.postalCode = "Postal code is required";
      if (!formData.country) newErrors.country = "Country is required";
      if (!selectedAddressId)
        newErrors.addressId = "Please select a shipping address";
    } else if (action === "payment") {
      if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber))
        newErrors.cardNumber = "Valid 16-digit card number is required";
      if (
        !formData.expiryDate ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)
      )
        newErrors.expiryDate = "Valid expiry date (MM/YY) is required";
      if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv))
        newErrors.cvv = "Valid CVV (3-4 digits) is required";
    }
    return newErrors;
  };

  // Handle form input changes with real-time validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Real-time validation for payment fields
    if (action === "payment" && ["cardNumber", "expiryDate", "cvv"].includes(name)) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Handle address selection
  const handleAddressChange = (e) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(
      (addr) => addr.id === parseInt(addressId)
    );
    if (selectedAddress) {
      setFormData({
        ...formData,
        street: selectedAddress.street || "",
        city: selectedAddress.city,
        postalCode: selectedAddress.postal_code,
        country: selectedAddress.country,
      });
    }
  };
// const updateStock = async (cartItems) => {
//   try {
//     const stockPromises = cartItems.map((item) =>
//       fetch(`http://127.0.0.1:8000/products/stock/${item.id}/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ quantity: item.quantity }),
//       })
//     );

//     const stockResponses = await Promise.all(stockPromises);

//     // Ensure responses are parsed properly
//     const stockData = await Promise.all(
//       stockResponses.map(async (response) => {
//         if (!response.ok) {
//           console.error(`Erreur lors de la mise à jour du stock pour ${item.id}:`, await response.text());
//           return null;
//         }
//         return response.json();
//       })
//     );

//     const allStockUpdated = stockData.every((result) => result && result.message === "Stock updated successfully");

//     if (!allStockUpdated) {
//       toast.error("Échec de mise à jour du stock pour certains articles.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } else {
//       toast.success("Stock mis à jour avec succès !");
//     }
//   } catch (error) {
//     console.error("Erreur dans l'actualisation du stock :", error);
//   }
// };

// Appel de la fonction lors du checkout


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form.", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return;
    }

    if (action === "info") {
      setAction("payment");
      setErrors({});
      return;
    }

    setIsLoading(true);
    const orderData = {
      user: userId,
      status: "pending",
      cart_items: cartItems.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price.toFixed(2),
      })),
      address_id: parseInt(selectedAddressId),
      total_amount: total.toFixed(2),
      shipping_cost: shipping.toFixed(2),
      tax: tax.toFixed(2),
      save_address: formData.saveAddress,
    };

    try {
// updateStock(cartItems);
      
      // const stockPromises = cartItems.map((item) =>
      //   fetch(`http://127.0.0.1:8000/products/stock/${item.id}/`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ quantity: item.quantity }),
      //   })
      // );
      // console.log("Stock promises:", stockPromises);
      // const stockResponses = await Promise.all(stockPromises);
      // const stockData = stockResponses.map((response) =>
      //   response.status === 200 ? response.json() : null
      // );
      // const stockResults = await Promise.all(stockData);
      // const allStockUpdated = stockResults.every((result) => result && result.success);
      // if (!allStockUpdated) {
      //   toast.error("Failed to update stock for some items.", {
      //     position: "top-right",
      //     autoClose: 3000,
      //   });
      //   return;
      // }

      const fetchPromise = fetch("http://127.0.0.1:8000/checkout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const delayPromise = new Promise((resolve) => setTimeout(resolve, 4000));
      const [response] = await Promise.all([fetchPromise, delayPromise]);
 

      if (response.status === 200 || response.status === 201) {
        const responseData = await response.json();
        setOrderDetails({
          orderId: responseData.order_id || "N/A",
          items: cartItems,
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          paymentMethod: `Card ending in ${formData.cardNumber.slice(-4)}`,
          subtotal,
          shipping,
          tax,
          total,
        });
        setAction("confirmation");
        clearCart();
      } else {
        let errorData;
        try {
          errorData = await response.json();
          console.log("Error data:", errorData);
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
          errorData = { error: "Invalid response from server" };
        }
        toast.error(errorData.error || `Failed to place order (status: ${response.status})`, {
          position: "top-right",
          autoClose: 3000,
        });
      }

      if (response.status === 200 || response.status === 201) {
      // Loop through cart items and update stock individually
      await Promise.all(cartItems.map((item) =>
        fetch(`http://127.0.0.1:8000/products/stock/${item.id}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: item.quantity }),
        })
      ));

    } else {
      toast.error("Failed to place order.", { autoClose: 3000 });
    }

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(`An error occurred during checkout: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 ">
      <style>
        {`
          .spinner {
            display: inline-block;
            width: 1.5rem;
            height: 1.5rem;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: #f6f0e1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 0.5rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .checkmark {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: inline-block;
            background: #28a745;
            position: relative;
          }
          .checkmark::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 40px;
            border: solid #fff;
            border-width: 0 6px 6px 0;
            transform: translate(-50%, -60%) rotate(45deg);
          }
        `}
      </style>
      <nav className="flex space-x-6 text-sm font-normal text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700 m-0 p-0">
          <i className="fa fa-solid fa-house"></i>
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <Link to="/shop" className="hover:text-gray-700 m-0 p-0">
          Shop
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <Link to="/cart" className="hover:text-gray-700 m-0 p-0">
          Shopping Cart
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-gray-700 mx-1">Checkout</span>
      </nav>
      <main className="max-w-[1200px] mx-auto  ">
        <ToastContainer />
        <nav
          aria-label="Progress"
          className="flex items-center space-x-4 text-sm font-normal mb-8 select-none"
        >
          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full ${
                action === "info"
                  ? "bg-[#9c6f3c] text-[#f6f0e1]"
                  : "bg-[#f6f0e1] border border-[#7a5a33aa] text-[#7a5a33aa]"
              } font-normal`}
            >
              1
            </div>
            <span className={action === "info" ? "text-[#3a2e1a]" : "text-[#7a5a33aa]"}>
              Shipping
            </span>
          </div>
          <div className="flex items-center text-[#7a5a33aa]">
            <span className="inline-block w-10 h-[1px] bg-[#7a5a33aa]"></span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full ${
                action === "payment"
                  ? "bg-[#9c6f3c] text-[#f6f0e1]"
                  : "bg-[#f6f0e1] border border-[#7a5a33aa] text-[#7a5a33aa]"
              } font-normal`}
            >
              2
            </div>
            <span className={action === "payment" ? "text-[#3a2e1a]" : "text-[#7a5a33aa]"}>
              Payment
            </span>
          </div>
          <div className="flex items-center text-[#7a5a33aa]">
            <span className="inline-block w-10 h-[1px] bg-[#7a5a33aa]"></span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full ${
                action === "confirmation"
                  ? "bg-[#9c6f3c] text-[#f6f0e1]"
                  : "bg-[#f6f0e1] border border-[#7a5a33aa] text-[#7a5a33aa]"
              } font-normal`}
            >
              3
            </div>
            <span className={action === "confirmation" ? "text-[#3a2e1a]" : "text-[#7a5a33aa]"}>
              Confirmation
            </span>
          </div>
        </nav>
        <section className="flex flex-col lg:flex-row gap-6 ">
          {action === "confirmation" ? (
            <div className="flex-1 bg-white  border border-[#c9bda9] rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
  <div className="text-center mb-8">
    <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
      <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h2>
    <p className="text-base text-gray-600">Your order has been successfully placed.</p>
  </div>
  <div className="space-y-6">
    <details className="border border-gray-200 rounded-lg p-5 bg-gray-50" open>
      <summary className="text-lg font-semibold text-gray-800 cursor-pointer flex items-center gap-2">
        <svg className="h-5 w-5 text-[#9c6f3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        Order Items
      </summary>
      <div className="mt-4 space-y-4">
        {orderDetails.items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            <img
              alt={`${item.name} product image`}
              className="w-14 h-14 object-cover rounded-lg shadow-sm"
              src={`http://127.0.0.1:8000${item.image}`}
            />
            <div className="flex-1 text-sm">
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-gray-600">Qty: <span className="font-medium">{item.quantity}</span></p>
              <p className="text-gray-600">Price: <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span></p>
            </div>
          </div>
        ))}
      </div>
    </details>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-[#9c6f3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Shipping Details
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-800">Order ID</p>
            <p className="text-gray-600">{orderDetails.orderId}</p>
          </div>
          <div>
            <p className="font-medium text-gray-800">Shipping Address</p>
            <p className="text-gray-600">
              {orderDetails.shippingAddress.street}, {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.country}
            </p>
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-[#9c6f3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Payment Details
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-800">Payment Method</p>
            <p className="text-gray-600">{orderDetails.paymentMethod}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-800">${orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-gray-800">${orderDetails.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span className="font-medium text-gray-800">${orderDetails.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="flex justify-center mt-8">
    <Link
      to="/shop"
      className="inline-block bg-[#9c6f3c] text-[#f6f0e1] px-4 py-2 rounded-lg text-base font-medium hover:bg-[#e0a969] transition-all duration-300 ease-in-out shadow-md"
    >
      Continue Shopping
    </Link>
  </div>
</div>
          ) : (
            <form
              aria-labelledby="shipping-info"
              className="flex-1 bg-[#f6f0e1] border border-[#c9bda9] rounded-md p-6 space-y-6"
              onSubmit={handleSubmit}
            >
              {action === "info" ? (
                <div className="space-y-5">
                  <h2
                    className="flex items-center gap-2 font-normal text-[#3a2e1a]"
                    id="shipping-info"
                  >
                    <i className="fas fa-map-marker-alt text-[#7a5a33]"></i>
                    Shipping Information
                  </h2>
                  <div className="mb-4">
                    <label className="block text-xs text-[#7a5a33cc] mb-1 font-normal">
                      Select Saved Address
                    </label>
                    <select
                      value={selectedAddressId || ""}
                      onChange={handleAddressChange}
                      className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                    >
                      <option value="">Select an address</option>
                      {addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.address_type}, {addr.city}, {addr.postal_code}, {addr.country}
                        </option>
                      ))}
                    </select>
                    {errors.addressId && (
                      <p className="text-red-500 text-xs mt-1">{errors.addressId}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                        htmlFor="firstName"
                      >
                        First Name
                      </label>
                      <input
                        className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] placeholder-[#7a5a33aa] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                        htmlFor="lastName"
                      >
                        Last Name
                      </label>
                      <input
                        className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] placeholder-[#7a5a33aa] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <input
                        className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] placeholder-[#7a5a33aa] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                        htmlFor="phone"
                      >
                        Phone Number
                      </label>
                      <input
                        className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] placeholder-[#7a5a33aa] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                      htmlFor="street"
                    >
                      Street Address
                    </label>
                    <input
                      className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] placeholder-[#7a5a33aa] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                      id="street"
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                        htmlFor="city"
                      >
                        City
                      </label>
                      <input
                        className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] placeholder-[#7a5a33aa] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                        id="city"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                        htmlFor="postalCode"
                      >
                        ZIP/Postal Code
                      </label>
                      <input
                        className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] placeholder-[#7a5a33aa] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                        id="postalCode"
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                        htmlFor="country"
                      >
                        Country
                      </label>
                      <select
                        className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      >
                        <option value="">Select a country</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Europe">Europe</option>
                        {/* Add more countries as needed */}
                      </select>
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                      )}
                    </div>
                  </div>
                  <div className="border border-[#c9bda9] rounded-md p-3 flex items-center gap-3 text-xs text-[#3a2e1a]">
                    <input
                      className="w-4 h-4 rounded border-[#7a5a33cc] text-[#7a5a33]"
                      id="saveAddress"
                      type="checkbox"
                      name="saveAddress"
                      checked={formData.saveAddress}
                      onChange={handleChange}
                    />
                    <label className="cursor-pointer" htmlFor="saveAddress">
                      Save this address for future orders
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <h2
                    className="flex items-center gap-2 font-normal text-[#3a2e1a] mt-4"
                    id="payment-info"
                  >
                    <i className="fas fa-credit-card text-[#7a5a33]"></i>
                    Payment Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="md:col-span-2">
                      <label
                        className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                        htmlFor="cardNumber"
                      >
                        Card Number
                      </label>
                      <input
                        className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] placeholder-[#7a5a33aa] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                        id="cardNumber"
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                        htmlFor="expiryDate"
                      >
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] placeholder-[#7a5a33aa] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                        id="expiryDate"
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-xs text-[#7a5a33cc] mb-1 font-normal"
                        htmlFor="cvv"
                      >
                        CVV
                      </label>
                      <input
                        className="w-full rounded-md border border-transparent bg-[#f6f0e1] px-3 py-2 text-sm text-[#3a2e1a] placeholder-[#7a5a33aa] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                        id="cvv"
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className={`flex ${action === "info" ? "justify-end" : "justify-between"}`}>
                {action === "payment" && (
                  <button
                    type="button"
                    className="bg-[#7a5a33] text-[#f6f0e1] px-5 py-2 rounded-md text-sm font-normal hover:bg-[#9c6f3c] transition-colors"
                    onClick={() => setAction("info")}
                  >
                    Back to Shipping
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#9c6f3c] text-[#f6f0e1] px-5 py-2 rounded-md text-sm font-normal hover:bg-[#7a5a33] transition-colors flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading && action === "payment" ? (
                    <>
                      <span className="spinner"></span>
                      Placing Order...
                    </>
                  ) : action === "info" ? (
                    "Continue to Payment"
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </form>
          )}
          {action !== "confirmation" ? (
            <aside
              aria-label="Order Summary"
              className="w-full max-w-sm bg-[#f6f0e1] border border-[#c9bda9] rounded-md p-6 text-[#3a2e1a]"
            >
              <h2 className="flex items-center gap-2 font-normal mb-4 text-[#3a2e1a]">
                <i className="fas fa-box-open text-[#7a5a33]"></i>
                Order Summary
              </h2>
              <div className="space-y-4 mb-4 border-b border-[#c9bda9] pb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      alt={`${item.name} product image`}
                      className="w-[60px] h-[60px] object-cover rounded"
                      height="60"
                      src={`http://127.0.0.1:8000${item.image}`}
                      width="60"
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-[#3a2e1a] mb-1">{item.name}</p>
                      <p className="text-[#7a5a33cc] mb-0.5">
                        Qty: <span className="font-semibold text-[#3a2e1a]">{item.quantity}</span>
                      </p>
                    </div>
                    <p className="font-semibold text-[#3a2e1a] self-center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-xs space-y-2 mb-4 border-b border-[#c9bda9] pb-4">
                <div className="flex justify-between text-[#7a5a33cc]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#3a2e1a]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7a5a33cc]">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#3a2e1a]">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7a5a33cc]">
                  <span>Tax</span>
                  <span className="font-semibold text-[#3a2e1a]">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-xs space-y-2 mb-4 border-b border-[#c9bda9] pb-4">
                <div className="flex justify-between font-semibold text-[#3a2e1a]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-[#7a5a33cc]">
                Estimated delivery: 3-5 business days
              </p>
            </aside>
          ) : (
            ""
          )}
        </section>
      </main>
    </div>
  );
};

export default Checkout;