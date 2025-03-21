import React from "react";
import "./Footer.css";

const Footer =()=>{
     return(
<footer className="footer">
  <div className="footer-content">
    <div className="footer-left">
      <img className="footer-logo" src="logo.png" alt="Mugs' Atelier" />
      <p>© 2025 Mugs' Atelier. All rights reserved.</p>
    </div>
    <div className="footer-center">
    <div className="social-icons">
    <a href="#">
    <i className="fab fa-facebook"></i>
    </a>
    <a href="#">
      <i className="fab fa-twitter"></i>
    </a>
    <a href="#">
      <i className="fab fa-instagram"></i>
    </a>
    <a href="#">
      <i className="fab fa-dribbble"></i>
    </a>
  </div>
    </div>
    <div className="footer-right">
      <ul className="footer-links">
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
      </ul>
    </div>
  </div>
</footer>
);
};

export default Footer;
