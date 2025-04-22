const Addresses = () => {
  return (
    <div className="tab-content p-4 full-width" id="adresses-content">
    
      <div
       
        class=" flex justify-between items-center mb-6"
      >
        <h1 class="text-xl">
          <i class="fas fa-map-marker-alt"></i> Saved Addresses
        </h1>
        <button class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-100">
          <i class="fas fa-plus"></i> Add New Address
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">
              <i class="fas fa-home"></i> Home
            </h2>
            <span class="bg-beige-200 text-beige-700 text-sm px-2 py-1 rounded-full">
              Default
            </span>
          </div>
          <p>John Doe</p>
          <p>123 Main Street</p>
          <p>Apt 4B</p>
          <p>San Francisco, CA 94103</p>
          <p>United States</p>
          <div class="flex justify-between items-center mt-4">
            <button class="text-gray-600 hover:text-gray-800 flex items-center">
              <i class="fas fa-edit mr-1"></i> Edit
            </button>
            <button class="text-red-600 hover:text-red-800 flex items-center">
              <i class="fas fa-trash-alt mr-1"></i> Remove
            </button>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">
              <i class="fas fa-briefcase"></i> Work
            </h2>
          </div>
          <p>John Doe</p>
          <p>456 Market Street</p>
          <p>Suite 100</p>
          <p>San Francisco, CA 94105</p>
          <p>United States</p>
          <div class="flex justify-between items-center mt-4">
            <button class="text-gray-600 hover:text-gray-800 flex items-center">
              <i class="fas fa-edit mr-1"></i> Edit
            </button>
            <button class="text-red-600 hover:text-red-800 flex items-center">
              <i class="fas fa-trash-alt mr-1"></i> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
