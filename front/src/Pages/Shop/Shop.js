import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Shop.css";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductListing = () => {
  const { addToCart } = useCart();
  const { products } = useContext(ProductContext);
  const { categories } = useContext(ProductContext);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(40);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const productsPerPage = 8; // Number of products per page
  // const currentQuantity = 1; // Default quantity for adding to cart
  // const [quantity, setQuantity] = useState(currentQuantity);

  // const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // const returnQuantity= (id)=>{
  //   if (cart){
  //     const quantity = cart.find((item) =>
  //       item.id === id
  //     )?.quantity;
  //     if (quantity) {
  //       setQuantity(quantity);
  //     } else {
  //       setQuantity(1);
  //     }
  //   };
  //   return quantity;
  // }

  // Filter products
  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory === "All") return true;
      return product.category === selectedCategory;
    })
    .filter((product) => product.price <= maxPrice)
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const navigate = useNavigate();
  const detailsProd = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  };
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <div className="bg-[#f5f2ed]">
      <nav className="flex text-sm font-normal text-gray-500 px-4 py-4 mb-2">
        <Link to="/" className="hover:text-gray-700 m-0 p-0">
          <i className="fa fa-solid fa-house"></i>{" "}
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <Link to="/shop" className="hover:text-gray-700 m-0 p-0">
          {" "}
          Shop
        </Link>
      </nav>
      <div className="containerShop px-5">
        <ToastContainer />
        <div className="filter-container">
          <button
            className="filter-icon md:hidden w-full text-[#6b5e4a] py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            {isFilterVisible ? (
              <>
                <span className="text-lg mr-1">✖</span>
                <span>Close Filters</span>
              </>
            ) : (
              <>
                <span className="text-lg mr-1">≡</span>
                <span>Show Filters</span>
              </>
            )}
          </button>

          <aside
            className={`filterDiv w-full md:w-64 bg-[#fcfaf5] rounded-lg p-4 flex flex-col gap-6 select-none ${
              isFilterVisible ? "visible" : ""
            }`}
          >
            <input
              className="w-full rounded-md border border-[#f0e9df] bg-[#fcfaf5] px-3 py-2 text-sm text-[#6b5e4a] placeholder-[#6b5e4a] focus:outline-none focus:ring-1 focus:ring-[#6b5e4a]"
              placeholder="Search mugs..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
              <h2 className="font-semibold text-sm my-2 text-[#1a1a1a]">
                Category
              </h2>
              <ul className="flex flex-col gap-2 text-[#1a1a1a] text-sm font-normal max-h-64 overflow-y-auto">
                <li>
                  <button
                    className={`rounded-md px-3 py-1 w-full text-left font-normal text-[#6b5e4a] ${
                      selectedCategory === "All"
                        ? "bg-[#f0e9df]"
                        : "hover:underline"
                    }`}
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                  >
                    All
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className={`rounded-md px-3 py-1 w-full text-left font-normal text-[#6b5e4a] ${
                        selectedCategory === cat.name
                          ? "bg-[#f0e9df]"
                          : "hover:underline"
                      }`}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-sm mb-2 text-[#1a1a1a] flex justify-between">
                <span>Max Price</span>
                <span className="font-normal">${maxPrice}</span>
              </h2>
              <input
                aria-label="Max Price Range"
                className="w-full accent-[#6b5e4a]"
                max="100"
                min="0"
                type="range"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <div className="flex justify-between text-xs text-[#a89f8f] mt-1 select-none">
                <span>$0</span>
                <span>$100</span>
              </div>
            </div>
          </aside>
        </div>

        <main className="products px-5 flex flex-col items-start gap-4">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  opacity: product.stock === 0 ? 0.7 : 1, // Dim out-of-stock items
                }}
              >
                <div className="d-flex justify-content-center align-items-center position-relative">
                  <img
                    src={`http://127.0.0.1:8000${product.image}`}
                    alt={product.name}
                    onClick={(e) => detailsProd(e, product.id)}
                    style={{
                      filter: product.stock === 0 ? "grayscale(100%)" : "none",
                    }}
                  />
                  {product.stock === 0 && (
                    <div className="out-of-stock-overlay">OUT OF STOCK</div>
                  )}
                </div>
                <h4>{product.name}</h4>
                <span className="price-container mt-2 row  ">
                  <p
                    className={`col-10 ${product.stock === 0 ? "out-of-stock-price" : ""}`}
                  >
                    ${product.price}
                  </p>
                  <button className="col-2 btn btn-sm" disabled={product.stock === 0} style={{ border: "none" }}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="20"
                      height="20"
                      viewBox="0 0 256 256"
                      className=" add-to-cart-icon"
                      style={{ cursor: "pointer" }}
                      onClick={() => addToCart(product, 1)}
                    >
                      <g
                        transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                        style={{
                          stroke: "none",
                          strokeWidth: 0,
                          strokeDasharray: "none",
                          strokeLinecap: "butt",
                          strokeLinejoin: "miter",
                          strokeMiterlimit: 10,
                          fill: "none",
                          fillRule: "nonzero",
                          opacity: 1,
                        }}
                      >
                        <path
                          d="M 72.975 58.994 H 31.855 c -1.539 0 -2.897 -1.005 -3.347 -2.477 L 15.199 13.006 H 3.5 c -1.933 0 -3.5 -1.567 -3.5 -3.5 s 1.567 -3.5 3.5 -3.5 h 14.289 c 1.539 0 2.897 1.005 3.347 2.476 l 13.309 43.512 h 36.204 l 10.585 -25.191 h -6.021 c -1.933 0 -3.5 -1.567 -3.5 -3.5 s 1.567 -3.5 3.5 -3.5 H 86.5 c 1.172 0 2.267 0.587 2.915 1.563 s 0.766 2.212 0.312 3.293 L 76.201 56.85 C 75.655 58.149 74.384 58.994 72.975 58.994 z"
                          transform="matrix(1 0 0 1 0 0)"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "currentColor",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          strokeLinecap="round"
                        />
                        <circle
                          cx="28.88"
                          cy="74.33"
                          r="6.16"
                          transform="matrix(1 0 0 1 0 0)"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "currentColor",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                        />
                        <circle
                          cx="74.59"
                          cy="74.33"
                          r="6.16"
                          transform="matrix(1 0 0 1 0 0)"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "currentColor",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                        />
                        <path
                          d="M 62.278 19.546 H 52.237 V 9.506 c 0 -1.933 -1.567 -3.5 -3.5 -3.5 s -3.5 1.567 -3.5 3.5 v 10.04 h -10.04 c -1.933 0 -3.5 1.567 -3.5 3.5 s 1.567 3.5 3.5 3.5 h 10.04 v 10.04 c 0 1.933 1.567 3.5 3.5 3.5 s 3.5 -1.567 3.5 -3.5 v -10.04 h 10.041 c 1.933 0 3.5 -1.567 3.5 -3.5 S 64.211 19.546 62.278 19.546 z"
                          transform="matrix(1 0 0 1 0 0)"
                          style={{
                            stroke: "none",
                            strokeWidth: 1,
                            strokeDasharray: "none",
                            strokeLinecap: "butt",
                            strokeLinejoin: "miter",
                            strokeMiterlimit: 10,
                            fill: "currentColor",
                            fillRule: "nonzero",
                            opacity: 1,
                          }}
                          strokeLinecap="round"
                        />
                      </g>
                    </svg>
                  </button>
                </span>
              </div>
            ))
          ) : (
            <p className="no-results">No products found</p>
          )}

          {/* Pagination Controls */}
        </main>
      </div>
      {totalPages > 1 && (
        <div className="pagination flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded-md bg-[#f0e9df] text-[#6b5e4a] hover:bg-[#e0d9cf] disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === index + 1
                  ? "bg-[#6b5e4a] text-white"
                  : "bg-[#f0e9df] text-[#6b5e4a] hover:bg-[#e0d9cf]"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 rounded-md bg-[#f0e9df] text-[#6b5e4a] hover:bg-[#e0d9cf] disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
