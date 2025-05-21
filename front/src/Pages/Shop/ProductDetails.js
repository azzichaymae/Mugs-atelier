import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Product.css";
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    console.log("Quantity changed:", event.target.value);
  };
  const { addToCart } = useCart();

  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${id}/ratings`
      );
      const data = await response.json();

      setRatings(data.ratings);
      setAvgRating(data.average_rating);
      return data;
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };
  const fetchImages = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${id}/images`
      );
      const data = await response.json();

      setImages(data.secondary_images);
      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  console.log(images);
  const handleBuyNow = () => {
    // Buy now logic here
    // console.log("Buy now:", product);
  };
  const fetchProductDetails = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/product/${id}/`
      );
      const data = await response.json();
      // console.log(data);
      setProduct(data);

      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const id_user = localStorage.getItem("user_id") || null;
  const handleAddRating = () => {
    if (!id_user) {
      if (window.confirm("Please login to submit a review.")) {
        navigate(`/login?redirect=/products/${id}/rate`);
      }
    } else {
      navigate(`/products/${product.id}/rate`);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchProductDetails();
    fetchRatings();
  }, [id]);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1); // -1 indicates product image

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : -1) // Loop back to product image
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex > -1 ? prevIndex - 1 : images.length - 1) // Loop to last secondary image
    );
  };

  // Determine the current image source
  const currentImageSrc =
    currentImageIndex === -1 ? product.image : images[currentImageIndex].image;
  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    const arrow = document.querySelector(".arrow");
    arrow.classList.add("hidden");
     
    setTimeout(() => {
      try {
        setIsSuccess(true);
        addToCart(product, quantity);
        setTimeout(() => {
          setIsSuccess(false);
          arrow.classList.remove("hidden");
         
        }, 1500);
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("An error occurred.", { autoClose: 1500 });
      } finally {
        setIsLoading(false);
      }
    }, 1800);
  };
  return (
    <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
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
      </nav>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        <ToastContainer />
        <section className="flex flex-col lg:flex-row lg:space-x-5">
          <div className="flex lg:flex-col gap-2 ">
            <div className="relative flex flex-col  items-start space-y-2">
              {[
                { id: `product-${product.id}`, image: product.image },
                ...images,
              ].map((img, index) => (
                <button
                  key={img.id}
                  aria-current={index === currentImageIndex + 1}
                  className={`border-2 rounded-md p-1 transition w-[80px] h-[80px] ${
                    index === currentImageIndex + 1
                      ? "border-[#A88D65]"
                      : "border-gray-200"
                  }`}
                  onClick={() =>
                    setCurrentImageIndex(index === 0 ? -1 : index - 1)
                  }
                >
                  <img
                    alt={img.id}
                    className="rounded w-full h-full object-cover"
                    src={`http://127.0.0.1:8000${img.image}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-4 lg:w-3/4">
            <div className="relative bg-gray-50 rounded-md overflow-hidden">
              <img
                alt={product.name}
                className="w-full"
                height="480"
                src={`http://127.0.0.1:8000${currentImageSrc}`}
                width="480"
              />
              <button
                aria-label="Previous image"
                className="absolute top-1/2 left-3 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                onClick={handlePreviousImage}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <button
                aria-label="Next image"
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                onClick={handleNextImage}
              >
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:w-1/2">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-semibold">{product.name}</h1>
                </div>
                <div className="flex items-center space-x-2 text-yellow-500 text-sm">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={i < avgRating ? "fas fa-star" : "far fa-star"}
                    ></i>
                  ))}

                  <span className="text-gray-400 text-xs">
                    ({ratings.length})
                  </span>
                </div>
              </div>
              <span className="text-sm flex items-between justify-between mb-3">
                <span className="text-red-600 font-semibold text-lg">
                  ${product.price}
                </span>
                <button
                  onClick={handleAddRating}
                  className="text-blue-500 hover:underline"
                >
                  Rate this product
                </button>
              </span>

              <div>
                <h5 className="h5 font-semibold">Description</h5>
                <p>{product.description}</p>
              </div>

              <div>
                <div className="row my-2">
                  <div className="col text-xs font-semibold text-gray-600">
                    Quantity
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-2">
                    <input
                      aria-label="Quantity"
                      className="col-2 border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
                      min="1"
                      type="number"
                      name="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-full">
                <button
                  onClick={handleAddToCart}
                  aria-label="Add to cart"
                  id="add-to-cart"
                  
className="btn btn-warning flex items-center justify-center space-x-2  text-white  px-5 py-1 w-full transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(212,160,23,0.6)] hover:bg-[#fbcb2b]   relative group"                >
                  <i className="fas fa-shopping-cart text-2xl drop-shadow-md"></i>
                  <span className="text-md">Add to Cart</span>

                  <span className="arrow absolute right-4   group-hover:opacity-100 transition-opacity duration-200 text-xxl">
                    <i class="fas fa-solid fa-arrow-right"></i>
                  </span>

                  {isLoading && (
                    <i className="fas fa-spinner fa-spin absolute right-4 text-xl"></i>
                  )}
                  {isSuccess && !isLoading && (
                    <i className="fas fa-check absolute right-4 text-xl text-white-500"></i>
                  )}
                </button>
                <i className="far fa-heart ml-2 text-xl transition-colors duration-200 hover:text-red-500"></i>
              </div>
              <div>
                <h3 className="text-sm font-semibold mt-3 mb-1">Delivery</h3>
                <p className="text-xs mb-3">
                  Free standard shipping on orders
                  <span className="font-semibold">over $35</span>
                  before tax, plus free returns.
                </p>
                <table className="w-full text-xs text-gray-600 mb-6">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left pb-2 font-semibold">TYPE</th>
                      <th className="text-left pb-2 font-semibold">HOW LONG</th>
                      <th className="text-left pb-2 font-semibold">HOW MUCH</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Standard delivery</td>
                      <td className="py-2">1-4 business days</td>
                      <td className="py-2">$4.50</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Express delivery</td>
                      <td className="py-2">1 business day</td>
                      <td className="py-2">$10.00</td>
                    </tr>
                    <tr>
                      <td className="py-2">Pick up in store</td>
                      <td className="py-2">1-3 business days</td>
                      <td className="py-2">Free</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex space-x-6">
                <img
                  alt="VISA credit card logo on white background"
                  className="h-8 w-auto"
                  height="32"
                  src="https://storage.googleapis.com/a1aa/image/6fa0a489-4809-4265-531b-28b61a47f2a4.jpg"
                  width="96"
                />
                <img
                  alt="Mastercard credit card logo on white background"
                  className="h-8 w-auto"
                  height="72"
                  src="https://storage.googleapis.com/a1aa/image/316123e9-e781-410e-3e0d-f54b87898561.jpg"
                  width="96"
                />
                <img
                  alt="PayPal payment logo on white background"
                  className="h-8 w-auto"
                  height="32"
                  src="https://storage.googleapis.com/a1aa/image/989f820c-bc92-4c5e-f3b4-2e3749b0d59a.jpg"
                  width="96"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="mt-10 max-w-5xl">
          <h3 className="text-lg mb-3 font-normal">Customer Reviews</h3>
          {ratings.map((rating, index) => (
            <article
              key={index}
              className="bg-white border border-[#d7c9b0] rounded-md p-4 text-xs text-[#5a3e1b] relative"
            >
              <div className="flex justify-between mb-2">
                <strong className="font-semibold">
                  {rating.user__email || "Anonymous"}
                </strong>
                <span className="text-[10px] text-[#a38a6a]">
                  {rating.created_at || "Just now"}
                </span>
              </div>
              <div className="text-[#a38a6a] text-sm mb-1">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fa-star ${i < rating.value ? "fas" : "far"}`}
                  ></i>
                ))}
              </div>
              <p>{rating.review}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
