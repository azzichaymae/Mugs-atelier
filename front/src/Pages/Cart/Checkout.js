import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // Prepare cart items for submission
  const cartItems = cart.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  }));
  const subtotal = cartItems
    .map((item) => item.price * item.quantity)
    .reduce((a, b) => a + b, 0);
  const shipping = 4.99; // Adjusted to match image
  const tax = 5.6; // Added tax from image
  const total = subtotal + shipping + tax;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
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
        console.log(data);
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
          setSelectedAddressId(data[0].id); // Default to first address
          setFormData((prevFormData) => ({
            ...prevFormData,
            streetAddress: data[0].street_address || "",
            city: data[0].city,
            stateProvince: data[0].state_province || "",
            postalCode: data[0].postal_code,
            country: data[0].country,
          }));
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Failed to load addresses.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    };

    // Sequence the fetches: fetch user data first, then addresses
    const fetchData = async () => {
      await fetchUserById();
      await fetchAddresses();
    };

    fetchData();
  }, [userId]);

  // Validate form data before submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.streetAddress)
      newErrors.streetAddress = "Street address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.stateProvince)
      newErrors.stateProvince = "State/Province is required";
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber))
      newErrors.cardNumber = "Valid 16-digit card number is required";
    if (
      !formData.expiryDate ||
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)
    )
      newErrors.expiryDate = "Valid expiry date (MM/YY) is required";
    if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv))
      newErrors.cvv = "Valid CVV (3-4 digits) is required";
    if (!selectedAddressId)
      newErrors.addressId = "Please select a shipping address";
    return newErrors;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        streetAddress: selectedAddress.street_address || "",
        city: selectedAddress.city,
        stateProvince: selectedAddress.state_province || "",
        postalCode: selectedAddress.postal_code,
        country: selectedAddress.country,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
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
      shipping_cost: shipping,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/checkout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Order placed successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        clearCart();
        setTimeout(() => {
          navigate("/shop");
        }, 2200);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to place order.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("An error occurred during checkout.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="  bg-[#f5f2ed] p-6">
      <nav className="flex space-x-6 text-sm font-normal text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700">
          <i className="fa fa-solid fa-house mx-1"></i>
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <Link to="/shop" className="hover:text-gray-700 mx-1">
          Shop
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <Link to={`/cart`} className="hover:text-gray-700 mx-1">
          Shopping Cart
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-gray-700 mx-1">Checkout</span>
      </nav>
      {/* <div className="max-w-7xl mx-auto">
        <ToastContainer />
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Checkout</h1>
          <p className="text-sm text-gray-600">Complete your purchase</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white rounded-lg shadow p-6 flex-1">
            <div className="flex items-center mb-4">
              <i className="fas fa-map-marker-alt text-[#8B6F47] mr-2"></i>
              <h2 className="text-lg font-semibold text-gray-800">
                Shipping Information
              </h2>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Saved Address
              </label>
              <select
                value={selectedAddressId || ""}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6F47]"
              >
                <option value="">Select an address</option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.label || "Address"} - {addr.street_address},{" "}
                    {addr.city}, {addr.postal_code}, {addr.country}
                  </option>
                ))}
              </select>
              {errors.addressId && (
                <p className="text-red-500 text-xs mt-1">{errors.addressId}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6F47]"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6F47]"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6F47]"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6F47]"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6F47]"
                />
                {errors.streetAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.streetAddress}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6F47]"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State/Province
                </label>
                <input
                  type="text"
                  name="stateProvince"
                  value={formData.stateProvince}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6F47]"
                />
                {errors.stateProvince && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stateProvince}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6F47]"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B6F47]"
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="saveAddress"
                  className="rounded border-gray-300 text-[#8B6F47] focus:ring-[#8B6F47]"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Save this address for future orders
                </span>
              </label>
            </div>
          </div>
          <aside className="bg-white rounded-lg shadow p-6 w-full max-w-sm">
            <div className="flex items-center mb-4">
              <i className="fas fa-box text-[#8B6F47] mr-2"></i>
              <h2 className="text-lg font-semibold text-gray-800">
                Order Summary
              </h2>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-700">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Color: {item.color || "N/A"} | Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="border-gray-200 my-4" />
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr className="border-gray-200 my-4" />
            <div className="flex justify-between font-semibold text-gray-800 mb-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600">Estimated delivery: 3-5 business days</p>
          </aside>
        </div>
        <div className="mt-6 text-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full max-w-xs bg-[#8B6F47] text-white py-3 rounded-md text-sm font-medium hover:bg-[#D4C7B0] transition"
          >
            Continue to Payment
          </button>
        </div>
      </div> */}
      <main class="max-w-[1200px] mx-auto">
        <ToastContainer />
        <nav class="flex items-center space-x-4 text-sm font-normal mb-8 select-none">
          <div class="flex items-center space-x-2">
            <div class="flex items-center justify-center w-7 h-7 rounded-full bg-[#9c6f3c] text-[#f6f0e0] text-xs">
              1
            </div>
            <span>Shipping</span>
          </div>
          <div class="flex items-center text-[#cfc9b9]">
            <span class="inline-block w-10 h-[1px] bg-[#cfc9b9]"></span>
          </div>
          <div class="flex items-center space-x-2 text-[#a08f7a]">
            <div class="flex items-center justify-center w-7 h-7 rounded-full bg-[#f6f0e0] border border-[#cfc9b9] text-xs">
              2
            </div>
            <span>Payment</span>
          </div>
          <div class="flex items-center text-[#cfc9b9]">
            <span class="inline-block w-10 h-[1px] bg-[#cfc9b9]"></span>
          </div>
          <div class="flex items-center space-x-2 text-[#a08f7a]">
            <div class="flex items-center justify-center w-7 h-7 rounded-full bg-[#f6f0e0] border border-[#cfc9b9] text-xs">
              3
            </div>
            <span>Confirmation</span>
          </div>
        </nav>
        <section class="flex flex-col lg:flex-row gap-6">
          <form
            aria-label="Shipping Information"
            class="flex-1 bg-[#f3ebd9] rounded-md border border-[#cfc9b9] p-6 space-y-6"
          >
            <h2 class="flex items-center gap-2 font-semibold text-[#3a2f1a] mb-4">
              <i class="fas fa-map-marker-alt text-[#7a5a33]"></i>
              Shipping Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-xs text-[#7a5a33] mb-1"
                  for="firstName"
                >
                  First Name
                </label>
                <input
                  class="w-full rounded-md border border-transparent bg-[#f6f0e0] px-3 py-2 text-sm text-[#3a2f1a] placeholder:text-[#a08f7a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
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
                <label class="block text-xs text-[#7a5a33] mb-1" for="lastName">
                  Last Name
                </label>
                <input
                  class="w-full rounded-md border border-transparent bg-[#f6f0e0] px-3 py-2 text-sm text-[#3a2f1a] placeholder:text-[#a08f7a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label class="block text-xs text-[#7a5a33] mb-1" for="email">
                  Email Address
                </label>
                <input
                  class="w-full rounded-md border border-transparent bg-[#f6f0e0] px-3 py-2 text-sm text-[#3a2f1a] placeholder:text-[#a08f7a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
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
                <label class="block text-xs text-[#7a5a33] mb-1" for="phone">
                  Phone Number
                </label>
                <input
                  class="w-full rounded-md border border-transparent bg-[#f6f0e0] px-3 py-2 text-sm text-[#3a2f1a] placeholder:text-[#a08f7a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                 {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs text-[#7a5a33] mb-1" for="street">
                  Street Address
                </label>
                <input
                  class="w-full rounded-md border border-transparent bg-[#f6f0e0] px-3 py-2 text-sm text-[#3a2f1a] placeholder:text-[#a08f7a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                />
                {errors.streetAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.streetAddress}
                  </p>
                )}
              </div>
              <div>
                <label class="block text-xs text-[#7a5a33] mb-1" for="city">
                  City
                </label>
                <input
                  class="w-full rounded-md border border-transparent bg-[#f6f0e0] px-3 py-2 text-sm text-[#3a2f1a] placeholder:text-[#a08f7a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label class="block text-xs text-[#7a5a33] mb-1" for="state">
                  State/Province
                </label>
                <input
                  class="w-full rounded-md border border-transparent bg-[#f6f0e0] px-3 py-2 text-sm text-[#3a2f1a] placeholder:text-[#a08f7a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                  type="text"
                  name="stateProvince"
                  value={formData.stateProvince}
                  onChange={handleChange}
                />
                {errors.stateProvince && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stateProvince}
                  </p>
                )}
              </div>
              <div>
                <label class="block text-xs text-[#7a5a33] mb-1" for="zip">
                  ZIP/Postal Code
                </label>
                <input
                  class="w-full rounded-md border border-transparent bg-[#f6f0e0] px-3 py-2 text-sm text-[#3a2f1a] placeholder:text-[#a08f7a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
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
                <label class="block text-xs text-[#7a5a33] mb-1" for="country">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  class="w-full rounded-md border border-transparent bg-[#f6f0e0] px-3 py-2 text-sm text-[#3a2f1a] focus:outline-none focus:ring-1 focus:ring-[#9c6f3c]"
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
               
              </div>
            </div>
            <label
              class="flex items-center gap-3 bg-[#f3ebd9] border border-[#cfc9b9] rounded-md px-4 py-3 text-xs cursor-pointer select-none"
              for="saveAddress"
            >
              <input
                class="w-4 h-4 rounded border-[#cfc9b9] text-[#9c6f3c] focus:ring-[#9c6f3c]"
                id="saveAddress"
                type="checkbox"
              />
              Save this address for future orders
            </label>
            <div class="flex justify-end">
              <button
                class="bg-[#9c6f3c] text-[#f6f0e0] rounded-md px-5 py-2 text-sm font-normal hover:bg-[#7a5a33] transition-colors"
                type="submit"
              >
                Continue to Payment
              </button>
            </div>
          </form>
          <aside
            aria-label="Order Summary"
            class="w-full max-w-[360px] bg-[#f3ebd9] rounded-md border border-[#cfc9b9] p-6 flex flex-col"
          >
            <h2 class="flex items-center gap-2 font-semibold text-[#3a2f1a] mb-4">
              <i class="fas fa-cube text-[#7a5a33]"></i>
              Order Summary
            </h2>
            <div class="space-y-4 mb-4">
              <div class="flex gap-4">
                <img
                  alt="Hand-Crafted Ceramic Mug product image showing two ceramic mugs with terracotta color"
                  class="w-[60px] h-[60px] object-cover rounded"
                  height="60"
                  loading="lazy"
                  src="https://storage.googleapis.com/a1aa/image/3cea772c-355d-4d71-7c10-34900ff52ee4.jpg"
                  width="60"
                />
                <div class="flex flex-col text-xs text-[#3a2f1a]">
                  <span class="font-semibold text-sm">
                    Hand-Crafted Ceramic Mug
                  </span>
                  <span>Color: Terracotta</span>
                  <span>
                    Qty:
                    <span class="font-semibold">2</span>
                  </span>
                </div>
                <div class="ml-auto font-semibold text-sm flex items-center">
                  $49.98
                </div>
              </div>
              <div class="flex gap-4">
                <img
                  alt="Artisan Coffee Mug product image showing a beige coffee mug on a beige background"
                  class="w-[60px] h-[60px] object-cover rounded"
                  height="60"
                  loading="lazy"
                  src="https://storage.googleapis.com/a1aa/image/fad3fecf-9a01-4994-eec1-d1d68aec944f.jpg"
                  width="60"
                />
                <div class="flex flex-col text-xs text-[#3a2f1a]">
                  <span class="font-semibold text-sm">Artisan Coffee Mug</span>
                  <span>Color: Beige</span>
                  <span>
                    Qty:
                    <span class="font-semibold">1</span>
                  </span>
                </div>
                <div class="ml-auto font-semibold text-sm flex items-center">
                  $19.99
                </div>
              </div>
            </div>
            <hr class="border-[#cfc9b9] mb-4" />
            <div class="flex justify-between text-sm text-[#7a5a33] mb-1">
              <span>Subtotal</span>
              <span class="font-semibold">$69.97</span>
            </div>
            <div class="flex justify-between text-sm text-[#7a5a33] mb-1">
              <span>Shipping</span>
              <span class="font-semibold">$4.99</span>
            </div>
            <div class="flex justify-between text-sm text-[#7a5a33] mb-4">
              <span>Tax</span>
              <span class="font-semibold">$5.60</span>
            </div>
            <hr class="border-[#cfc9b9] mb-4" />
            <div class="flex justify-between font-semibold text-sm text-[#3a2f1a] mb-4">
              <span>Total</span>
              <span>$80.56</span>
            </div>
            <hr class="border-[#cfc9b9] mb-4" />
            <div class="flex justify-between font-semibold text-sm text-[#3a2f1a] mb-4">
              <span>Total</span>
              <span>$80.56</span>
            </div>
            <p class="text-xs text-[#7a5a33]">
              Estimated delivery: 3-5 business days
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Checkout;
