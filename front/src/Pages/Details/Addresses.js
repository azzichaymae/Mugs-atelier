import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Addresses = () => {
  const userId = localStorage.getItem("user_id");
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
   
    postal_code: "",
    country: "",
    address_type: "Home",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!userId) {
      setError("User ID not found. Please log in.");
      return;
    }

    fetch(`http://127.0.0.1:8000/user/${userId}/addresses/`)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        return res.json();
      })
      .then((data) => setAddresses(data))
      .catch((err) => {
        setError("Failed to fetch addresses. Please try again later.");
      });
  }, [showForm]);

  const validateForm = () => {
    const errors = {};
    if (!newAddress.street.trim()) errors.street = "Street address is required";
    if (!newAddress.city.trim()) errors.city = "City is required";
    if (!newAddress.postal_code.trim()) {
      errors.postal_code = "Postal code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(newAddress.postal_code)) {
      errors.postal_code = "Invalid postal code format (e.g., 12345 or 12345-6789)";
    }
    if (!newAddress.country.trim()) errors.country = "Country is required";
    if (!newAddress.address_type) errors.address_type = "Address type is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addAddress = () => {
    setShowForm(true);
    setFormErrors({});
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
    // Clear error for the field being edited
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      
      return;
    }

    fetch(`http://127.0.0.1:8000/user/${userId}/addresses/new/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAddress),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to add address: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAddresses([...addresses, data]);
        setNewAddress({
          street: "",
          city: "",
         
          postal_code: "",
          country: "",
          address_type: "Home",
        });
        setShowForm(false);
        setError("");
      })
      .catch((err) => {
        setError("Failed to add address. Please try again.");
      });
  };

  const editAddress = (id) => {
    console.log("Edit Address button clicked for ID:", id);
  };

  const removeAddress = (id) => {
    fetch(`http://127.0.0.1:8000/user/${userId}/addresses/${id}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to remove address: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setAddresses(addresses.filter((address) => address.id !== id));
        toast.success("Address deleted successfully.", {
                  position: "top-right",
                  autoClose: 2000,
                });
      })
      .catch((err) => {
        setError("Failed to remove address. Please try again.");
      });
  };

  return (
    <div className="full-width tab-content" id="adresses-content">
      <ToastContainer />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {showForm ? (
        <div className="max-w-5xl rounded-lg" id="addform-content">
          <div className="flex items-center gap-2 px-6 py-4 border-b rounded-t-lg">
            <i className="fas fa-map-marker-alt text-gray-700"></i>
            <h2 className="text-gray-900 font-semibold text-lg">Add New Address</h2>
          </div>

          <div className="d-flex justify-center items-center">
            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6"
            >
              <div>
                <label
                  htmlFor="street"
                  className="block mb-1 text-gray-700 text-sm font-normal"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={newAddress.street}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                  className={`w-full rounded-md border ${
                    formErrors.street ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                />
                {formErrors.street && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.street}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block mb-1 text-gray-700 text-sm font-normal"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  placeholder="Oujda"
                  className={`w-full rounded-md border ${
                    formErrors.city ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                />
                {formErrors.city && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="postal"
                  className="block mb-1 text-gray-700 text-sm font-normal"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postal"
                  name="postal_code"
                  value={newAddress.postal_code}
                  onChange={handleInputChange}
                  placeholder="10001"
                  className={`w-full rounded-md border ${
                    formErrors.postal_code ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                />
                {formErrors.postal_code && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.postal_code}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block mb-1 text-gray-700 text-sm font-normal"
                >
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={newAddress.country}
                  onChange={handleInputChange}
                  placeholder="Morocco"
                  className={`w-full rounded-md border ${
                    formErrors.country ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                />
                {formErrors.country && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="addressType"
                  className="block mb-1 text-gray-700 text-sm font-normal"
                >
                  Address Type
                </label>
                <select
                  id="addressType"
                  name="address_type"
                  value={newAddress.address_type}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border ${
                    formErrors.address_type ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.address_type && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.address_type}</p>
                )}
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 text-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#8B6F47] text-white inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2"
                >
                  <i className="fas fa-save"></i> Save Address
                </button>
              </div>
            </form>
            <div>
              <img
                src="address.png"
                alt="Address Icon"
                className="w-80 h-50"
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl">
              <i className="fas fa-map-marker-alt"></i> Saved Addresses
            </h1>
            <button
              onClick={addAddress}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-100"
            >
              <i className="fas fa-plus"></i> Add New Address
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    <i className="fas fa-home"></i> {address.address_type}
                  </h2>
                </div>
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p>{address.country}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => editAddress(address.id)}
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <i className="fas fa-edit mr-1"></i> Edit
                  </button>
                  <button
                    onClick={() => removeAddress(address.id)}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    <i className="fas fa-trash-alt mr-1"></i> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Addresses;