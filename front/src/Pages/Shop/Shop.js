import React, { useState } from "react";
import "./Shop.css";


const products = [
     { id: 1, name: "Coffee Mug", price: 10, category: "Classic", image: "/mugCoffee.jpg" },
     { id: 2, name: "Travel Mug", price: 15, category: "Travel", image: "/mugTravel.jpg" },
     { id: 3, name: "Funny Mug", price: 12, category: "Funny", image: "/mugFunny.webp" },
     { id: 4, name: "Office Mug", price: 8, category: "Office", image: "/mugOffice.jpg" },
  { id: 5, name: "Designer Mug", price: 20, category: "Classic", image: "/mugDesigner.avif" },
];

const categories = ["All", "Classic", "Travel", "Funny", "Office"];

const ProductListing = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products
    .filter((product) => selectedCategory === "All" || product.category === selectedCategory)
    .filter((product) => product.price <= maxPrice)
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="containerShop">
      {/* Sidebar */}
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
          {categories.map((cat) => (
            <li key={cat} className={selectedCategory === cat ? "active" : ""}
                onClick={() => setSelectedCategory(cat)}>
              {cat}
            </li>
          ))}
        </ul>
        <h6>Max Price: ${maxPrice}</h6>
        <input
          type="range"
          min="5"
          max="20"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </aside>

      {/* Product Grid */}
      <main className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
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