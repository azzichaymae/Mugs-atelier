import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductDetails = ( ) => {
  const { id } = useParams(); 
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);


  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  } 
  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  }
  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };
  const handleCartToggle = () => {
    setIsInCart(!isInCart);
  }
  const { addToCart } = useCart();
  
  const handleBuyNow = () => {
    // Buy now logic here
    // console.log("Buy now:", product);
  };
  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/products/product/${id}/`);
      const data = await response.json();
      // console.log(data);
      setProduct(data);

      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
 useEffect(() => {
    fetchProductDetails();
  }, [id]);

  
  if (!product) {
    return <div>Loading...</div>;
  }
  return (
    <main class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <nav class="flex space-x-6 text-sm font-normal text-gray-500 mb-6">
        {/* <button
          aria-current="page"
          class="border border-teal-700 text-teal-700 rounded px-4 py-1.5 font-semibold"
        >
          General info
        </button>
        <button class="hover:text-gray-700">Product details</button>
         <button class="flex items-center space-x-1 hover:text-gray-700">
       <span>
        Reviews
       </span>
       <span class="text-xs text-gray-400">
        13
       </span>
      </button>  */}
      
  <Link to="/" class="hover:text-gray-700 m-0 p-0"><i class="fa fa-solid fa-house"></i> </Link>
  <span class="text-gray-400 mx-1">/</span>
  <Link to="/shop" class="hover:text-gray-700 m-0 p-0"> Shop</Link>
  <span class="text-gray-400 mx-1">/</span>
  <Link to={`/product/${id}`} class="hover:text-gray-700 m-0 p-0">{product.name}</Link>
</nav>
<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
 <section class="flex flex-col lg:flex-row lg:space-x-12">
        <div class="flex flex-col space-y-4 lg:w-1/2">
          <div class="relative bg-gray-50 rounded-md overflow-hidden">
            <img
              alt={product.name}
              class="w-full "
              height="480"
              src={`http://127.0.0.1:8000${product.image}`}
              width="480"
            />
            <button
              aria-label="Previous image"
              class="absolute top-1/2 left-3 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              <i class="fas fa-arrow-left"></i>
            </button>
            <button
              aria-label="Next image"
              class="absolute top-1/2 right-3 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
          <div class="flex space-x-3">
            <button
              aria-current="true"
              class="border-2 border-teal-700 rounded-md p-1"
            >
              <img
                alt="Thumbnail of white ceramic mug front view"
                class="rounded"
                height="72"
                src="https://storage.googleapis.com/a1aa/image/5e8064f9-bf72-4cd2-eb5f-1fda697d1bba.jpg"
                width="72"
              />
            </button>
            <button class="border border-gray-300 rounded-md p-1">
              <img
                alt="Thumbnail of white ceramic mug side view"
                class="rounded"
                height="72"
                src="https://storage.googleapis.com/a1aa/image/5cf0ca14-f548-49cf-37cc-57b8a72d0294.jpg"
                width="72"
              />
            </button>
            <button class="border border-gray-300 rounded-md p-1">
              <img
                alt="Thumbnail closeup of ceramic mug texture"
                class="rounded"
                height="72"
                src="https://storage.googleapis.com/a1aa/image/fab71e8f-608d-4f2c-1a2d-6fd4a8fb3b6a.jpg"
                width="72"
              />
            </button>
            <button class="border border-gray-300 rounded-md p-1">
              <img
                alt="Thumbnail closeup of ceramic mug handle"
                class="rounded"
                height="72"
                src="https://storage.googleapis.com/a1aa/image/7e80d37d-9b01-4a17-5a3b-262e15273486.jpg"
                width="72"
              />
            </button>
            <button class="border border-gray-300 rounded-md p-1 relative">
              <img
                alt="Thumbnail with play icon for video of ceramic mug"
                class="rounded opacity-70"
                height="72"
                src="https://storage.googleapis.com/a1aa/image/3c3e654d-4dcc-4118-9b65-5d72fe4fffbf.jpg"
                width="72"
              />
              <div
                aria-hidden="true"
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <i class="fas fa-play-circle text-white text-2xl"></i>
              </div>
            </button>
          </div>
        </div>

        <div class="mt-10 lg:mt-0 lg:w-1/2">
        
          <div class="flex flex-col space-y-4">
            <div class="flex items-center justify-between">
              
              <div class="flex items-center space-x-2">
              <h1 class="text-2xl font-semibold ">{product.name}</h1>
                
                {/* <span class="line-through text-gray-400 text-sm">${product.price}</span>
                <span class="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                  -50%
                </span> */}
              </div>
              <div class="flex items-center space-x-2 text-yellow-500 text-sm">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="far fa-star"></i>
                <span class="text-gray-400 text-xs">12 reviews</span>
              </div>
            </div>
            <div>
            <span class="text-red-600 font-semibold text-lg">${product.price}</span>
              <h5 class="h5 font-semibold">Description</h5>
              <p>{product.description}</p>
            </div>
            {/* <div>
         <label class="block text-xs font-semibold text-gray-600 mb-1">
          Color
         </label>
         <div class="flex items-center space-x-4 text-xs text-gray-500">
          <label class="flex items-center space-x-1 cursor-pointer">
           <input class="w-4 h-4 border border-gray-300 rounded-full text-teal-700 focus:ring-teal-700" name="color" type="radio"/>
           <span aria-label="Color option white" class="w-4 h-4 rounded-full border border-gray-300 bg-white">
           </span>
          </label>
          <label class="flex items-center space-x-1 cursor-pointer">
           <input class="w-4 h-4 border border-gray-300 rounded-full text-teal-700 focus:ring-teal-700" name="color" type="radio"/>
           <span aria-label="Color option black" class="w-4 h-4 rounded-full border border-gray-300 bg-black">
           </span>
          </label>
          <label class="flex items-center space-x-1 cursor-pointer">
           <input checked="" class="w-4 h-4 border border-gray-300 rounded-full text-teal-700 focus:ring-teal-700" name="color" type="radio"/>
           <span aria-label="Color option blue" class="w-4 h-4 rounded-full border border-gray-300 bg-blue-400">
           </span>
           <span class="text-gray-400 ml-1">
            Blue
           </span>
          </label>
         </div>
        </div> */}
            <div>
              <div class="row">
                {/*    */}
                <div class="col text-xs font-semibold text-gray-600">
                  Quantity
                </div>
              </div>
              <div class="row">
                {/* <div class="col">
                  <select
                    class="col-6 border border-gray-300 rounded px-3 py-2 text-xs w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
                    id="size"
                    name="size"
                  >
                    <option>Please select</option>
                    <option>8 oz</option>
                    <option>12 oz</option>
                    <option>16 oz</option>
                  </select>
                </div> */}
                <div class="col">
                  <input
                    aria-label="Quantity"
                    class="w-16 border border-gray-300 rounded   py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
                    min="1"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    
                     
                  />
                </div>
              </div>

              {/* <div className='row'>
          <label class="col-6 block text-xs font-semibold text-gray-600 mb-1" for="size">
          Size
         </label>
          <label class="col-6 block text-xs font-semibold text-gray-600 mb-1" for="size">
          Quantity
         </label>
          </div>
         
          <div className='row'>
          <select class="col-7 border border-gray-300 rounded px-3 py-2 text-xs w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700" id="size" name="size">
           <option>
            Please select
           </option>
           <option>
            8 oz
           </option>
           <option>
            12 oz
           </option>
           <option>
            16 oz
           </option>
          </select>
          
          <input aria-label="Quantity" class="col-2  border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700" min="1" type="number" value="1"/>

          </div> */}
            </div>
            <div class="flex items-center space-x-3">
              <button 
                onClick={() => addToCart(product,quantity)}  
                aria-label="Add to cart"
                class="flex items-center justify-center space-x-2 border border-teal-700 text-teal-700 text-xs font-semibold rounded px-4 py-2 hover:bg-teal-50"
              >
                {/* <i class="fas fa-solid fa-cart-plus"></i> */}
                <i class="fas fa-solid fa-plus"></i>
                <span>Add to cart</span>
              </button>
              <button
                aria-label="Buy now"
                class="flex items-center justify-center space-x-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded px-4 py-2"

              >
                {/* <i class="far fa-heart"></i>*/}<i class="fas fa-shopping-cart"></i> 
                <span>Buy now</span>
              </button>
            </div>
            <div>
              <h3 class="text-sm font-semibold mb-1">Delivery</h3>
              <p class="text-xs mb-3">
                Free standard shipping on orders
                <span class="font-semibold">over $35</span>
                before tax, plus free returns.
              </p>
              <table class="w-full text-xs text-gray-600 mb-6">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left pb-2 font-semibold">TYPE</th>
                    <th class="text-left pb-2 font-semibold">HOW LONG</th>
                    <th class="text-left pb-2 font-semibold">HOW MUCH</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-gray-100">
                    <td class="py-2">Standard delivery</td>
                    <td class="py-2">1-4 business days</td>
                    <td class="py-2">$4.50</td>
                  </tr>
                  <tr class="border-b border-gray-100">
                    <td class="py-2">Express delivery</td>
                    <td class="py-2">1 business day</td>
                    <td class="py-2">$10.00</td>
                  </tr>
                  <tr>
                    <td class="py-2">Pick up in store</td>
                    <td class="py-2">1-3 business days</td>
                    <td class="py-2">Free</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* <div>
         <h3 class="text-sm font-semibold mb-1">
          Return
         </h3>
         <p class="text-xs mb-2">
          You have
          <span class="font-semibold">
           60 days
          </span>
          to return the
                item(s) using any of the following methods:
         </p>
         <ul class="list-disc list-inside text-xs text-gray-600 space-y-1">
          <li>
           Free store return
          </li>
          <li>
           Free returns via USPS Dropoff Service
          </li>
         </ul>
         <hr class="border-t border-gray-200 mt-6"/>
        </div> */}
            {/* <div class="flex items-center space-x-4 text-xs text-gray-600 mt-4 mb-6">
              <span>Share:</span>
              <a
                aria-label="Share on Facebook"
                class="hover:text-gray-900"
                href="#"
              >
                <i class="fab fa-facebook-f"></i>
              </a>
              <a
                aria-label="Share on Twitter"
                class="hover:text-gray-900"
                href="#"
              >
                <i class="fab fa-twitter"></i>
              </a>
              <a
                aria-label="Share on Pinterest"
                class="hover:text-gray-900"
                href="#"
              >
                <i class="fab fa-pinterest-p"></i>
              </a>
            </div> */}
            <div class="flex space-x-6">
              <img
                alt="VISA credit card logo on white background"
                class="h-8 w-auto"
                height="32"
                src="https://storage.googleapis.com/a1aa/image/6fa0a489-4809-4265-531b-28b61a47f2a4.jpg"
                width="96"
              />
              <img
                alt="Mastercard credit card logo on white background"
                class="h-8 w-auto"
                height="32"
                src="https://storage.googleapis.com/a1aa/image/316123e9-e781-410e-3e0d-f54b87898561.jpg"
                width="96"
              />
              <img
                alt="PayPal payment logo on white background"
                class="h-8 w-auto"
                height="32"
                src="https://storage.googleapis.com/a1aa/image/989f820c-bc92-4c5e-f3b4-2e3749b0d59a.jpg"
                width="96"
              />
            </div>
          </div>
        </div>
      </section>
</div>
     
    </main>
  );
};

export default ProductDetails;
