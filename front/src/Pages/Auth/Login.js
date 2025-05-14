import React, { useState, useEffect } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = new URLSearchParams(window.location.search).get("redirect") || "/shop";  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [password, setPassword] = useState("");
  const [passwordSignup, setPasswordSignup] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorLog, setErrorLog] = useState("");
  const [errorRegister, setErrorRegister] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [errorEmailSignup, setErrorEmailSignup] = useState("");
  const [errorPasswordSignup, setErrorPasswordSignup] = useState("");

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
  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorLog("");
    setErrorEmail("");
    setErrorPassword("");
  
    if (!email || !password) {
      if (!email) setErrorEmail("Email is required.");
      if (!password) setErrorPassword("Password is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorEmail("Please enter a valid email address.");
      return;
    }
  
    try {
      setErrorPassword("");
      setErrorEmail("");
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
  
      // Parse the JSON response
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("user_id", data.user.id);
        alert("Login successful!");
        navigate(redirectUrl);
      } else {
        setErrorLog(data.error || "Login failed");
      }
    } catch (error) {
      setErrorLog("Network error. Please try again.");
    }
  };

  const validateInputs = () => {
    let hasErrors = false;

    // Reset all errors
    setErrorName('');
    setErrorEmailSignup('');
    setErrorPasswordSignup('');
    setErrorConfirmPassword('');
    setErrorRegister('');

    // Name validation
    if (!name) {
      setErrorName('Name is required.');
      hasErrors = true;
    } else if (name.length < 2) {
      setErrorName('Name must be at least 2 characters long.');
      hasErrors = true;
    }

    // Email validation
    if (!emailRegister) {
      setErrorEmailSignup('Email is required.');
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRegister)) {
      setErrorEmailSignup('Please enter a valid email address.');
      hasErrors = true;
    }

    // Password validation
    if (!passwordSignup) {
      setErrorPasswordSignup('Password is required.');
      hasErrors = true;
    } else if (passwordSignup.length < 8 || !/[a-zA-Z]/.test(passwordSignup) || !/\d/.test(passwordSignup)) {
      setErrorPasswordSignup('Password must be at least 8 characters long and contain letters and numbers.');
      hasErrors = true;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setErrorConfirmPassword('Please confirm your password.');
      hasErrors = true;
    } else if (confirmPassword != passwordSignup) {
  setErrorConfirmPassword('Passwords do not match.');
  console.log(confirmPassword)
  console.log(passwordSignup)
      hasErrors = true;
    }

    return !hasErrors;
  };

  // Handle input changes for real-time validation
  const handleInputChange = () => {
    validateInputs();
  };

  // Handle signup button click
  const handleRegister = async () => {
    const isValid = validateInputs();
    if (isValid) {
      try {
        const response = await fetch("http://127.0.0.1:8000/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailRegister, passwordSignup, name }),
        });
  
        const data = await response.json();
        console.log(data);
  
        if (response.ok) {
          
          alert("Register successful!");
          window.location.href = "/login";
        } else {
          setErrorRegister(data.error || "Register failed");
        }
      } catch (error) {
        setErrorRegister("Network error. Please try again.");
      }
    } else {
      setErrorRegister('Please fix the errors above to sign up.');
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
            <span className="error-message">{errorEmail}</span>
            <input
              type="password"
              className="password ele rounded"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="error-message">{errorPassword}</span>
            <div className="d-flex justify-content-center">
              <button className="clkbtn" onClick={handleLogin}>
                Login
              </button>
            </div>

            {errorLog && <span className="error-message text-center">{errorLog}</span>}
          </div>
          {/* Signup Form */}
          <div className="signup-box">
      <input
        type="text"
        className="name ele rounded"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          handleInputChange();
        }}
      />
      <span className="error-message">{errorName}</span>
      <input
        type="email"
        className="email ele rounded"
        placeholder="youremail@email.com"
        value={emailRegister}
        onChange={(e) => {
          setEmailRegister(e.target.value);
          handleInputChange();
        }}
      />
      <span className="error-message">{errorEmailSignup}</span>
      <input
        type="password"
        className="password ele rounded"
        placeholder="password"
        value={passwordSignup}
        onChange={(e) => {
          setPasswordSignup(e.target.value);
          handleInputChange();
        }}
      />
      <span className="error-message">{errorPasswordSignup}</span>
      <input
        type="password"
        className="password ele rounded"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          handleInputChange();
        }}
      />
      <span className="error-message">{errorConfirmPassword}</span>
      <div className="d-flex justify-content-center">
        <button className="clkbtn" onClick={handleRegister}>
          Signup
        </button>
      </div>
      <span className="error-message text-center">{errorRegister}</span>
    </div>
        </div>
      </div>
      <div className="col-5 d-flex align-items-center justify-content-center pb-5"></div>
    </div>
  );
};

export default Login;
