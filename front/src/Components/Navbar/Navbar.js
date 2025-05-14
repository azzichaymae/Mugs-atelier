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
  const id = localStorage.getItem("user_id") ;
  console.log(id)
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
      <div className="navbar-container px-4">
        <div className="logo-container">
          <NavLink to="/">
            <img src="logo.png" alt="Mugs' Atelier" className="logo-img" />
          </NavLink>
          <div className="logo-text">
            <h4 className="logo-title">Mugs' Atelier</h4>
            <p id="p" className="logo-subtitle">Unique Mugs for Every Taste</p>
          </div>
        </div>
        
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <input
              className="w-full rounded-full bg-[#EDE5D9] text-[#7F6649] text-xs py-1 px-3 pl-8 placeholder-[#7F6649] focus:outline-none focus:ring-2 focus:ring-[#7F6649] "
              placeholder="Search"
              type="text"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7F6649]">
              <FaSearch />
            </span>
          </div>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ul className={`menu ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              <FaHome /><span className="ml-1">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop" onClick={() => setMenuOpen(false)}>
              <FaStore /> <span className="ml-1">Shop</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={id ? "/account" : "/login"}
              onClick={() => setMenuOpen(false)}
            >
              <FaUser /> <span className="ml-1">Account</span>
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
              <span className="ml-1">Cart</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;