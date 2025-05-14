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

  const navigate = useNavigate();
  const detailsProd = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  };
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  return (
    <div class="bg-[#f5f2ed]">
      {/* Adjusted margin to reduce space */}
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
      <div className="containerShop px-5 ">
        <ToastContainer />
        <div className="filter-container">
          {/* Filter Icon for smaller screens */}
          <div
            className="filter-icon"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            <span role="img" aria-label="filter">
              <i className="fa fa-solid fa-filter"></i>
            </span>{" "}
          </div>

          {/* Filter Aside Component */}
          <aside className={`filter ${isFilterVisible ? "visible" : ""}`}>
            <h5>Filters</h5>
            <input
              type="text"
              placeholder="🔍 Search mugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <h6>Category</h6>
            <ul>
              <li
                key="All"
                className={selectedCategory === "All" ? "active" : ""}
                onClick={() => setSelectedCategory("All")}
              >
                All
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={selectedCategory === cat.name ? "active" : ""}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
            <h6 className="pt-3">Max Price: ${maxPrice}</h6>
            <input
              type="range"
              min="5"
              max="40"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </aside>
        </div>

        <main className="products px-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "300px",
                }}
              >
                <div>
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      src={`http://127.0.0.1:8000${product.image}`}
                      alt={product.name}
                      onClick={(e) => detailsProd(e, product.id)}
                    />
                  </div>
                  <h4>{product.name}</h4>
                </div>
                <span className="mt-2">
                  <p>${product.price}</p>
                  <button className="btn btn-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      width="20"
                      height="20"
                      viewBox="0 0 256 256"
                      className="add-to-cart-icon"
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
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
