import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get("redirect") || "/";


  const [name, setName] = useState("");
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
  const [action, setAction] = useState("login");

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
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("user_id", data.user.id);
        alert("Login successful!");
        navigate(redirectTo);
      } else {
        setErrorLog(data.error || "Login failed");
      }
    } catch (error) {
      setErrorLog("Network error. Please try again.");
    }
  };

  const validateInputs = () => {
    let hasErrors = false;

    setErrorName('');
    setErrorEmailSignup('');
    setErrorPasswordSignup('');
    setErrorConfirmPassword('');
    setErrorRegister('');

    if (!name) {
      setErrorName('Name is required.');
      hasErrors = true;
    } else if (name.length < 2) {
      setErrorName('Name must be at least 2 characters long.');
      hasErrors = true;
    }

    if (!emailRegister) {
      setErrorEmailSignup('Email is required.');
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRegister)) {
      setErrorEmailSignup('Please enter a valid email address.');
      hasErrors = true;
    }

    if (!passwordSignup) {
      setErrorPasswordSignup('Password is required.');
      hasErrors = true;
    } else if (passwordSignup.length < 8 || !/[a-zA-Z]/.test(passwordSignup) || !/\d/.test(passwordSignup)) {
      setErrorPasswordSignup('Password must be at least 8 characters long and contain letters and numbers.');
      hasErrors = true;
    }

    if (!confirmPassword) {
      setErrorConfirmPassword('Please confirm your password.');
      hasErrors = true;
    } else if (confirmPassword !== passwordSignup) {
      setErrorConfirmPassword('Passwords do not match.');
      hasErrors = true;
    }

    return !hasErrors;
  };

  const handleRegister = async () => {
    const isValid = validateInputs();
    if (isValid) {
      try {
        const response = await fetch("http://127.0.0.1:8000/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailRegister: emailRegister, passwordSignup: passwordSignup, name }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Register successful!");
          setAction("login")
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
    <div className="bg-white">
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-1/2 w-full">
          <img
            alt="Beige background with large text MUGS' ATELIER and a brown ceramic coffee cup on a wooden coaster with steam rising"
            className="object-cover w-full h-full"
            height="1000"
            src="./bg.jpg"
            width="800"
          />
        </div>
        <div className="md:w-1/2 w-full flex items-center justify-center mt-2">
          <div className="w-full max-w-lg">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-[#E6D9C8] rounded-full p-4 mb-2">
                <i className="fas fa-coffee text-[#6B3E1A] text-xl"></i>
              </div>
              <h1 className="text-[#6B3E1A] font-semibold text-xl">
                Mugs' Atelier
              </h1>
              <p className="text-[#6B3E1A] text-sm mt-1">
                Handcrafted, personalized mugs that tell your story
              </p>
            </div>
            <div className="border border-[#E6D9C8] rounded-lg p-6 space-y-6 text-[#6B3E1A] min-h-[580px]">
              <div>
                <h2 className="font-semibold text-lg mb-1 text-center">
                  {action === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-center text-sm mb-4">
                  {action === 'login'
                    ? 'Sign in to your account to continue'
                    : 'Join us to discover handcrafted mugs for every occasion'}
                </p>
              </div>
              <div className="flex rounded-md overflow-hidden border border-[#C49A6C] mb-4">
                <button
                  className={`flex-1 ${
                    action === 'login'
                      ? 'bg-[#A67C52] text-white'
                      : 'bg-[#E6E4E1] text-[#6B3E1A]'
                  } py-2 text-center text-sm font-normal`}
                  type="button"
                  onClick={() => setAction('login')}
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 ${
                    action === 'login'
                      ? 'bg-[#E6E4E1] text-[#6B3E1A]'
                      : 'bg-[#A67C52] text-white'
                  } py-2 text-center text-sm font-normal`}
                  type="button"
                  onClick={() => setAction('register')}
                >
                  Register
                </button>
                
              </div>
              {action === 'login' ? (
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  errorLog={errorLog}
                  errorEmail={errorEmail}
                  errorPassword={errorPassword}
                  handleLogin={handleLogin}
                  action={action}
                  setAction={setAction}

                />
              ) : (
                <RegisterForm
                  name={name}
                  setName={setName}
                  emailRegister={emailRegister}
                  setEmailRegister={setEmailRegister}
                  passwordSignup={passwordSignup}
                  setPasswordSignup={setPasswordSignup}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  errorRegister={errorRegister}
                  errorName={errorName}
                  errorEmailSignup={errorEmailSignup}
                  errorPasswordSignup={errorPasswordSignup}
                  errorConfirmPassword={errorConfirmPassword}
                  handleRegister={handleRegister}
                   action={action}
                  setAction={setAction}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;