import React, { useEffect, useState } from "react";
import "./Home.css";
import { useContext } from "react";
import { ProductContext } from "../../context/ProductContext";

const Home = () => {

  const fetchRatings = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${id}/ratings`
      );
      const data = await response.json();
      setRatings((prevRatings) => ({
        ...prevRatings,
        [id]: data.average_rating,
      }));
      return data.average_rating;
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const { products } = useContext(ProductContext);
  const [ratings, setRatings] = useState({});
  useEffect(() => {
    products.forEach((element) => {
      fetchRatings(element.id);
    });
  }, [products]);
  const sortable = Object.entries(ratings)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topRatedProducts = sortable.map(([id]) =>
    products.find((product) => product.id === parseInt(id))
  );

  return (
    <>
      <div className="banner">
        <div className="banner-content">
          <h2>Discover the Best Mugs for Every Occasion</h2>
          <p>Handcrafted, personalized mugs that tell your story.</p>
          <a
            href="/shop"
            className="btn bg-[#8B6F47] text-white w-40 hover:bg-[#8B6F47]"
          >
            Shop Now
          </a>
        </div>
      </div>

      <section className="featured-products mt-4" id="shop">
        <h2>Top Rated</h2>
        <div className="product-list">
          {topRatedProducts.map((product) =>
            product ? ( // Add a check to ensure product exists
              <a href={`/product/${product.id}`} key={product.id} className="div product-item">
                <img
                  src={`http://127.0.0.1:8000${product.image}`}
                  alt={product.name}
                />
                <p>{product.name}</p>
                <span>${product.price}</span>
              </a>
            ) : null
          )}
        </div>
      </section>
    </>
  );
};

export default Home;