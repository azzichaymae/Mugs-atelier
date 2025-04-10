import React, { useState } from "react";
import "./Shop.css";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";

const ProductListing = () => {
  const { products } = useContext(ProductContext);
  const { categories } = useContext(ProductContext);
  console.log(products);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(40);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory === "All") return true;
      return product.category === selectedCategory || product.name.includes(selectedCategory) ; 
    })
    .filter((product) => product.price <= maxPrice)
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  return (
    <div className="containerShop">
     
      <aside className="filter">
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

        <h6>Max Price: ${maxPrice}</h6>
        <input
          type="range"
          min="5"
          max="40"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </aside>

      
      <main className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={`http://127.0.0.1:8000${product.image}`}
                alt={product.name}
              />
              <h4>{product.name}</h4>
              <p>${product.price}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No products found</p>
        )}
      </main>
    </div>
  );
};

export default ProductListing;
