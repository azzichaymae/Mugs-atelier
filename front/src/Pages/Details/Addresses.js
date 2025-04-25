import { useState, useEffect } from "react";
const Addresses = () => {
  const userId = localStorage.getItem("user_id");
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetch(`http://127.0.0.1:8000/user/${userId}/addresses/`)
      .then(res => {
        if (!res.ok) throw new Error("Fetch error: " + res.status);
        return res.json(); 
      })
      .then(data => setAddresses(data))
      .catch(err => console.error("Error fetching addresses:", err));
  }, [userId]);
  

  const [showForm, setShowForm] = useState(false);

 
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    address_type: "home",
  });

  const addAddress = () => {
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newAddress)
    fetch(`http://127.0.0.1:8000/user/${userId}/addresses/new/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAddress),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add address");
        return res.json();
      })
      .then((data) => {
        setAddresses([...addresses, data]);
        setShowForm(false);
        setNewAddress({
          street: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
          address_type: "home",
        });
      })
      .catch((err) => console.error("Error adding address:", err));
  };

  const editAddress = (id) => {
    // Logic to edit an address
    console.log("Edit Address button clicked for ID:", id);
  };

  const removeAddress = (id) => {
    // Logic to remove an address
    console.log("Remove Address button clicked for ID:", id);
  };

  return (
    <div className="tab-content p-4 full-width" id="adresses-content">
       {showForm ? (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       
        <input
          type="text"
          name="street"
          value={newAddress.street}
          onChange={handleInputChange}
          placeholder="Street"
          className="border border-gray-300 p-2 rounded"
          required
        />
        
        <input
          type="text"
          name="city"
          value={newAddress.city}
          onChange={handleInputChange}
          placeholder="City"
          className="border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="text"
          name="state"
          value={newAddress.state}
          onChange={handleInputChange}
          placeholder="State"
          className="border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="text"
          name="postal_code"
          value={newAddress.postal_code}
          onChange={handleInputChange}
          placeholder="Postal Code"
          className="border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="text"
          name="country"
          value={newAddress.country}
          onChange={handleInputChange}
          placeholder="Country"
          className="border border-gray-300 p-2 rounded"
          required
        />
        <select
          name="address_type"
          value={newAddress.address_type}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="home">Home</option>
          <option value="work">Work</option>
        </select>
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Address
        </button>
      </div>
    </form>
  ):
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
                <i className="fas fa-home"></i>{" "}
                {address.address_type.charAt(0).toUpperCase() +
                  address.address_type.slice(1)}
              </h2>
              {address.is_default && (
                <span className="bg-beige-200 text-beige-700 text-sm px-2 py-1 rounded-full">
                  Default
                </span>
              )}
            </div>
            <p>{address.full_name || "John Doe"}</p>
            <p>{address.street}</p>
            {address.apartment && <p>{address.apartment}</p>}
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
  }
      
    </div>
  );
};

export default Addresses;
