import React, { useEffect } from "react";
import "./Login.css"; // Import the CSS for animations

const Login = () => {
  
  useEffect(() => {
    const signup = document.querySelector(".signup");
    const login = document.querySelector(".login");
    const slider = document.querySelector(".slider");
    const formSection = document.querySelector(".form-section");

    if (!signup || !login || !slider || !formSection) {
      console.error("One or more elements not found!");
      return;
    }

    signup.addEventListener("click", () => {
      slider.classList.add("moveslider");
      formSection.classList.add("form-section-move");
    });

    login.addEventListener("click", () => {
      slider.classList.remove("moveslider");
      formSection.classList.remove("form-section-move");
    });

    // Cleanup event listeners on unmount
    return () => {
      signup.removeEventListener("click", () => {
        slider.classList.add("moveslider");
        formSection.classList.add("form-section-move");
      });

      login.removeEventListener("click", () => {
        slider.classList.remove("moveslider");
        formSection.classList.remove("form-section-move");
      });
    };
  }, []); // Runs after the component mounts

  return (
    <div className="row rowDiv p-5">
    <div className="container col-5 ">
    
      <div className="slider"></div>
      <div className="btn">
        <button className="login">Login</button>
        <button className="signup">Signup</button>
      </div>

      <div className="form-section">
        <div className="login-box">
          <input type="email" className="email ele rounded" placeholder="youremail@email.com"/>
          <input type="password" className="password ele rounded" placeholder="password"/>
          <button className="clkbtn">Login</button>
        </div>

        <div className="signup-box">
          <input type="text" className="name ele rounded"  placeholder="Enter your name"/>
          <input type="email" className="email ele rounded" placeholder="youremail@email.com"/>
          <input type="password" className="password ele rounded" placeholder="password"/>
          <input type="password" className="password ele rounded" placeholder="Confirm password"/>
          <button className="clkbtn">Signup</button>
        </div>
      </div>
    </div>
    <div className="col-7 d-flex align-items-center justify-content-center pb-5"><img  src="logo.png"  />
    </div>
    
    
    </div>
  );
};

export default Login;