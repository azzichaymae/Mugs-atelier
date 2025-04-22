import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaHome,
  FaSearch,
  FaBars,
  FaTimes,
  FaShoppingBasket,
  FaUser,
  FaStore,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const id = localStorage.getItem("user_id") || null;
  const { cart } = useCart();
  
  const totalItems = cart.length;
  
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 50) {
        navbar.style.position = "fixed";
      } else {
        navbar.style.position = "";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
        document.getElementById("p").style.display = "block";
      } else {
        document.getElementById("p").style.display = "none";
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container px-6  max-w-full">
        <div className="logo-container">
          <NavLink to="/">
            {" "}
            <img src="logo.png" alt="Mugs' Atelier" />
          </NavLink>
          <div className="logo-text">
            <h4>Mugs' Atelier</h4>
            <p id="p">Unique Mugs for Every Taste</p>
          </div>
        </div>
        <div class="flex-1 max-w-lg mx-6">
          <div class="relative">
            <input
              class="w-full rounded-full bg-[#EDE5D9] text-[#7F6649] text-sm py-2 px-4 pl-10 placeholder-[#7F6649] focus:outline-none"
              placeholder="Search"
              type="text"
            />
            <i class="fas fa-search absolute left-2 top-1/2 transform -translate-y-1/2 text-[#7F6649] text-sm"></i>
          </div>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ul className={`menu ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              <FaHome /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop" onClick={() => setMenuOpen(false)}>
              <FaStore /> Shop
            </NavLink>
          </li>
          <li>
            <NavLink
              to={id ? "/account" : "/login"}
              onClick={() => setMenuOpen(false)}
            >
              <FaUser /> Account
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cart"
              onClick={() => setMenuOpen(false)}
              style={{ position: "relative" }}
            >
              <FaShoppingCart />
              <span className="cart-count">{totalItems}</span>
              Cart
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
