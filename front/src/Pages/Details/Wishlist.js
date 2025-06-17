import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
const Wishlist = () => {
  const userId = localStorage.getItem("user_id"); // Assuming userId is stored in localStorage
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/wishlist/${userId}/`) // Assuming this endpoint returns wishlist data
      .then((response) => response.json())
      .then((data) => setWishlist(data.wishlist))
      .catch((error) => console.error("Error fetching wishlist:", error));
  }, [userId]);
  const clearWishlist = (id) => {
    id
      ? fetch(`http://127.0.0.1:8000/wishlist/${userId}/clear/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to clear wishlist");
            } else {
              setWishlist((wishlist) =>
                wishlist.filter((item) => item.id !== id)
              );
              toast.success("Wishlist item deleted successfully!",
                {
                  position: "top-center",
                  autoClose: 1000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                }
              );
            }
          })
          .catch((error) => {
            console.error("Error clearing wishlist:", error);
            toast.error("Failed to clear wishlist");
          })
      : fetch(`http://127.0.0.1:8000/wishlist/${userId}/clear/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to clear wishlist");
            } else {
              setWishlist([]);
              toast.success("Wishlist cleared successfully!");
            }
          })
          .catch((error) => {
            console.error("Error clearing wishlist:", error);
            toast.error("Failed to clear wishlist");
          });
  };

  return (
    <>
      <ToastContainer />
      <div
        id="wishlist-content"
        className="full-width tab-content p-4 rounded-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl">
            <i className="fa fa-light fa-heart mr-2"></i> My Wishlist
          </h1>
          <button className="text-gray-600" onClick={() => clearWishlist()}>
            Clear All
          </button>
        </div>
        <div className="space-y-4">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              <div
                key={item.product_id}
                className="relative group flex items-center justify-between bg-cream-light p-2 rounded-lg border border-brown-light hover:shadow-lg transition-shadow duration-300"
              >
                <button
                  className="hidden absolute top-0 right-2 text-gray-600 group-hover:flex transition-all duration-200"
                  onClick={() => clearWishlist(item.id)}
                >
                  <i className="fas fa-times"></i>
                </button>

                <div className="flex items-center">
                  <img
                    className="w-20 h-20 rounded-lg mr-4"
                    src={`http://127.0.0.1:8000${item.product_image}`}
                    alt={item.product_name}
                  />
                  <div>
                    <h2 className="text-md text-black">{item.product_name}</h2>
                    <p className="text-yellow-700 text-l font-semibold">
                      ${item.product_price}
                    </p>
                    <p
                      className={
                        item.stock === "In Stock"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {item.stock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    className={`btn btn-sm text-white px-4 py-1 rounded-md flex items-center space-x-2 ${
                      item.stock === "In Stock"
                        ? ""
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={item.stock !== "In Stock"}
                    style={{
                      backgroundColor:
                        item.stock === "In Stock" ? "#94713b" : "#ccc",
                    }}
                    onClick={() => {
                      addToCart(item.product, 1);
                    }}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">Your wishlist is empty.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
