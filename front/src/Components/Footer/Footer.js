import React from "react";

const Footer = () => {
  return (
  <footer class="bg-[#5a4a3c] text-[#d7cfc3] text-xs ">
   <div class="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 flex justify-between">
    <div class="space-y-3">
     <p>
      Elevate your daily ritual with our handcrafted mugs,<br/> designed for
          comfort and style.
     </p>
     <div class="flex space-x-4 text-sm">
      <a aria-label="Facebook" class="hover:text-white transition" href="#">
       <i class="fab fa-facebook-f">
       </i>
      </a>
      <a aria-label="Twitter" class="hover:text-white transition" href="#">
       <i class="fab fa-twitter">
       </i>
      </a>
      <a aria-label="Instagram" class="hover:text-white transition" href="#">
       <i class="fab fa-instagram">
       </i>
      </a>
      <a aria-label="GitHub" class="hover:text-white transition" href="#">
       <i class="fab fa-github">
       </i>
      </a>
     </div>
    </div>
    <div class="flex flex-col space-y-2">
     <a class="hover:text-white transition" href="/">
      Home
     </a>
     <a class="hover:text-white transition" href="/shop">
      Shop
     </a>
     <a class="hover:text-white transition" href="#">
      About Us
     </a>
     <a class="hover:text-white transition" href="#">
      Contact
     </a>
    </div>
    <div class="flex flex-col space-y-2">
     <a class="hover:text-white transition" href="/shop">
      Ceramic Mugs
     </a>
     <a class="hover:text-white transition" href="/shop">
      Travel Mugs
     </a>
     <a class="hover:text-white transition" href="/shop">
      Coffee Sets
     </a>
     <a class="hover:text-white transition" href="/shop">
      Specialty Mugs
     </a>
    </div>
    <div class="flex flex-col space-y-2">
     <p>
      Mugs' Atelier 
     </p>
     <p>
      Morocco, CA 91234
     </p>
     <p>
      Email: hello@mugsatelier.com
     </p>
     <p>
      Phone: (123) 456-7890
     </p>
    </div>
   </div>
   <div class="border-t border-[#4a3d31] max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between text-[#d7cfc3] text-xs">
    <p>
     © 2025 Mugs' Atelier. All rights reserved.
    </p>
    <div class="flex space-x-4 mt-2 sm:mt-0">
     <a class="hover:text-white transition" href="#">
      Privacy Policy
     </a>
     <a class="hover:text-white transition" href="#">
      Terms of Service
     </a>
     <a class="hover:text-white transition" href="#">
      Shipping Info
     </a>
    </div>
   </div>
  </footer>
  );
};

export default Footer;