import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Shop.css";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";
import { Link } from "react-router-dom";

const ProductListing = () => {
  const { products } = useContext(ProductContext);
  
  const { categories } = useContext(ProductContext);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(40);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "All")
    return true;
    return product.category === selectedCategory; 
  }).filter((product) => product.price <= maxPrice).filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  ); 
  
  const navigate = useNavigate();
  const detailsProd = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  };
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  console.log("Selected Category:", selectedCategory, filteredProducts);


  return (
    <>
      <nav class="flex  text-sm font-normal text-gray-500 px-4 mt-4 mb-2">
        <Link to="/" class="hover:text-gray-700 m-0 p-0">
          <i class="fa fa-solid fa-house"></i>{" "}
        </Link>
        <span class="text-gray-400 mx-1">/</span>
        <Link to="/shop" class="hover:text-gray-700 m-0 p-0">
          {" "}
          Shop
        </Link>
      </nav>
      <div className="containerShop px-5 py-2">
        <div className="filter-container">
          {/* Filter Icon for smaller screens */}
          <div
            className="filter-icon"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
          >
            <span role="img" aria-label="filter">
              <i class="fa fa-solid fa-filter"></i>
            </span>{" "}
            {/* You can replace this with an icon library like FontAwesome */}
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
                onClick={(e) => detailsProd(e, product.id)}
              >
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={`http://127.0.0.1:8000${product.image}`}
                    alt={product.name}
                  />
                </div>
                <h4>{product.name}</h4>
                <span className="d-flex justify-content-end">
                  <p>${product.price}</p>
                </span>
              </div>
            ))
          ) : (
            <p className="no-results">No products found</p>
          )}
        </main>
      </div>
    </>
  );
};

export default ProductListing;
