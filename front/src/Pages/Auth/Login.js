import React, { useState, useEffect } from "react";
import "./Login.css";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

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
  }, []);

  // Function to handle login
  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.setItem("user_id", data.user.id);
        alert("Login successful!");
        window.location.href = "/shop";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const handleRegister = async () => {
    setError("");
    if (!email || !password || !confirmPassword || !name) {
      setError("Required parameters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        
        alert("Register successful!");
        window.location.href = "/login";
      } else {
        setError(data.error || "Register failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };
  return (
    <div className="row rowDiv p-5">
      <div className="container col-7">
        <div className="slider"></div>
        <div className="btn btn-grp">
          <button className="login">Login</button>
          <button className="signup">Signup</button>
        </div>

        <div className="form-section">
          {/* Login Form */}
          <div className="login-box">
            <input
              type="email"
              className="email ele rounded"
              placeholder="youremail@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="password ele rounded"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="clkbtn" onClick={handleLogin}>
              Login
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>

          {/* Signup Form (To be implemented later) */}
          <div className="signup-box">
            <input
              type="text"
              className="name ele rounded"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="email ele rounded"
              placeholder="youremail@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

            />
            <input
              type="password"
              className="password ele rounded"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

            />
            <input
              type="password"
              className="password ele rounded"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}

            />
            <button className="clkbtn" onClick={handleRegister}>Signup</button>
            {error && <p className="error-message">{error}</p>}
          
          </div>
        </div>
      </div>
      <div className="col-5 d-flex align-items-center justify-content-center pb-5"></div>
    </div>
  );
};

export default Login;
