import React from "react";
import './Home.css';


const Home = () => {
  return (
    <>
     
      <section className="banner" id="home">
        <div className="banner-content">
          <h2>Discover the Best Mugs for Every Occasion</h2>
          <p>Handcrafted, personalized mugs that tell your story.</p>
          <a href="/shop" className="btn">
            Shop Now
          </a>
        </div>
      </section>

      <section className="featured-products mt-4" id="shop">
        <h2>Featured Products</h2>
        <div className="product-list">
          <div className="product-item">
            <img src="mugCoffee.jpg" alt="Mug 1" />
            <p>Personalized Mug</p>
            <span>$15.99</span>
          </div>
          <div className="product-item">
            <img src="mugFunny.webp" alt="Mug 2" />
            <p>Funny Mug</p>
            <span>$12.99</span>
          </div>
          <div className="product-item">
            <img src="mugOffice.jpg" alt="Mug 3" />
            <p>Elegant Mug</p>
            <span>$18.99</span>
          </div>
        </div>
      </section>


     
    </>
  );
};

export default Home;
