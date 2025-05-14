import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const ProductRatings = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const id_user = localStorage.getItem("user_id") || null;

  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/products/product/${id}/`);
      const data = await response.json();
      setProduct(data);
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/products/${id}/ratings/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRatings(data.ratings);
        setLoading(false);
      } catch (err) {
        setError("Failed to load ratings.");
        setLoading(false);
        console.error("Error fetching ratings:", err);
      }
    };
    fetchRatings();
    fetchProductDetails();

    // Preserve scroll position on mount
    window.scrollTo(0, 0); // Start at top initially, but allow natural scrolling
    return () => {
      // Cleanup to ensure scroll behavior is not interfered with
    };
  }, [id]);

  function StarRating({ onChange }) {
    const handleMouseEnter = (value) => {
      setHoverRating(value);
    };

    const handleMouseLeave = () => {
      setHoverRating(0);
    };

    const handleClick = (value) => {
      setSelectedRating(value);
      if (onChange) onChange(value);
    };

    const clearRating = () => {
      setSelectedRating(0);
      if (onChange) onChange(0);
    };

    return (
      <div className="flex items-center space-x-2 mb-4 text-[#a38a6a] text-lg">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
            className="focus:outline-none"
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(value)}
          >
            <i
              className={`fa-star ${
                (hoverRating || selectedRating) >= value ? "fas text-[#a38a6a]" : "far"
              }`}
            ></i>
          </button>
        ))}
        <span
          className="text-xs text-[#a38a6a] ml-4 cursor-pointer select-none"
          onClick={clearRating}
        >
          Clear
        </span>
      </div>
    );
  }

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  const addRate = async (event) => {
    event.preventDefault();
    if (!id_user) {
      alert("Please log in to submit a review.");
      navigate("/login");
      return;
    }
    const review = document.getElementById("review").value;

    if (!selectedRating) {
      alert("Please select a rating.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/products/${id}/rate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: Math.min(5, Math.max(1, parseInt(selectedRating))),
          review,
          user: parseInt(id_user),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Thank you for your review!");
        setRatings((prevRatings) => [...prevRatings, data]);
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("An error occurred while submitting your review.");
    }
  };

  return (
    <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ minHeight: "100vh" }}>
      <nav className="flex space-x-6 text-sm font-normal text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700 m-0 p-0">
          <i className="fa fa-solid fa-house"></i>{" "}
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <Link to="/shop" className="hover:text-gray-700 m-0 p-0">
          {" "}
          Shop
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <Link to={`/product/${id}`} className="hover:text-gray-700 m-0 p-0">
          {product.name}
        </Link>
        <span className="text-gray-400 mx-1">/</span>
        <Link to={`/products/${id}/rate`} className="hover:text-gray-700 m-0 p-0">
          Rating
        </Link>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <section className="flex flex-col lg:flex-row gap-6">
          <article className="bg-white rounded-lg border border-[#d7c9b0] flex-1 flex flex-col justify-between">
            <div className="p-6">
              <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
              <p className="text-xs text-[#5a3e1b]/70 mb-6">
                Handcrafted ceramic mug from our special collection
              </p>
              <div className="bg-[#f3ead7] rounded-lg w-48 h-48 mx-auto flex items-center justify-center text-[#a38a6a] text-sm">
                <img
                  alt={product.name}
                  src={`http://127.0.0.1:8000${product.image}`}
                  width="480"
                />
              </div>
            </div>
            <footer className="border-t border-[#d7c9b0] px-6 py-3 flex justify-between items-center text-sm">
              <span>${product.price}</span>
            </footer>
          </article>
          {/* Right card */}
          <article className="bg-white rounded-lg border border-[#d7c9b0] flex-1 flex flex-col justify-between">
            <div className="p-6">
              <h2 className="font-semibold text-lg mb-1">Your Review</h2>
              <p className="text-xs text-[#5a3e1b]/70 mb-4">
                Share your experience with this product
              </p>
              <form onSubmit={addRate}>
                <label
                  className="block text-sm font-semibold mb-1"
                  htmlFor="rating"
                >
                  Rating
                </label>
                <StarRating />
                <label
                  className="block text-sm font-semibold mb-1"
                  htmlFor="review"
                >
                  Review
                </label>
                <textarea
                  className="w-full rounded-md border border-[#e6d9c3] bg-[#f9f4e4] text-xs text-[#5a3e1b] p-3 resize-y focus:outline-none"
                  id="review"
                  placeholder="Tell us what you think about this product..."
                  rows="4"
                ></textarea>
                <button
                  id="submit"
                  className="mt-6 w-full bg-[#c4b296] text-white text-sm font-normal py-3 rounded-md hover:bg-[#b3a37f] transition-colors"
                  type="submit"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
};

export default ProductRatings;