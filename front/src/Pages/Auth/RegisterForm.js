import React, { useState } from "react";

const RegisterForm = ({
  name,
  setName,
  emailRegister,
  setEmailRegister,
  passwordSignup,
  setPasswordSignup,
  confirmPassword,
  setConfirmPassword,
  errorRegister,
  errorName,
  errorEmailSignup,
  errorPasswordSignup,
  errorConfirmPassword,
  handleRegister,
  action, setAction,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("You must accept the Terms of Service and Privacy Policy.");
      return;
    }
    handleRegister();
  };

  return (
    <form className="space-y-5 text-sm font-normal" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="fullname" className="block mb-1">
          Full Name
        </label>
        <div className="flex items-center border border-[#C49A6C] rounded-md px-3 py-2 text-[#A67C52]">
          <i className="fas fa-user mr-2"></i>
          <input
            id="fullname"
            name="fullname"
            type="text"
            placeholder="Your full name"
            className="w-full bg-transparent outline-none text-[#6B3F1A] placeholder-[#A67C52]"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {errorName && <p className="text-xs text-red-500 mt-1">{errorName}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block mb-1">
          Email
        </label>
        <div className="flex items-center border border-[#C49A6C] rounded-md px-3 py-2 text-[#A67C52]">
          <i className="fas fa-envelope mr-2"></i>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            className="w-full bg-transparent outline-none text-[#6B3F1A] placeholder-[#A67C52]"
            required
            value={emailRegister}
            onChange={(e) => setEmailRegister(e.target.value)}
          />
        </div>
        {errorEmailSignup && <p className="text-xs text-red-500 mt-1">{errorEmailSignup}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block mb-1">
          Password
        </label>
        <div className="flex items-center justify-between border border-[#C49A6C] rounded-md px-3 py-2 text-[#A67C52]">
          <div className="flex items-center space-x-2">
            <i className="fas fa-lock"></i>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="bg-transparent outline-none text-[#6B3F1A] placeholder-[#A67C52]"
              required
              value={passwordSignup}
              onChange={(e) => setPasswordSignup(e.target.value)}
            />
          </div>
          <button
            type="button"
            aria-label="Toggle password visibility"
            className="text-[#A67C52]"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
          </button>
        </div>
        {errorPasswordSignup && <p className="text-xs text-red-500 mt-1">{errorPasswordSignup}</p>}
      </div>
      <div>
        <label htmlFor="confirm-password" className="block mb-1">
          Confirm Password
        </label>
        <div className="flex items-center justify-between border border-[#C49A6C] rounded-md px-3 py-2 text-[#A67C52]">
          <div className="flex items-center space-x-2">
            <i className="fas fa-key"></i>
            <input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none text-[#6B3F1A] placeholder-[#A67C52]"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            aria-label="Toggle confirm password visibility"
            className="text-[#A67C52]"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
          </button>
        </div>
        {errorConfirmPassword && <p className="text-xs text-red-500 mt-1">{errorConfirmPassword}</p>}
      </div>
      <div className="flex items-center space-x-2 text-xs text-[#6B3F1A]">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="w-4 h-4 border border-[#6B3F1A]"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          required
        />
        <label htmlFor="terms" className="select-none">
          I accept the Terms of Service and Privacy Policy
        </label>
      </div>
      {errorRegister && <p className="text-xs text-red-500 text-center">{errorRegister}</p>}
      <button
        type="submit"
        className="w-full bg-[#6B3F1A] text-white py-2 rounded-md text-sm font-normal"
      >
        Create Account
      </button>
      <p className="text-center text-xs">
        Already have an account? <a  onClick={()=> setAction("login")} className="underline">Sign in</a>
      </p>
      <hr className="border-t border-[#D9D1C7] my-6" />
      <p className="text-center text-xs text-[#A67C52]">
        By continuing, you agree to Mugs' Atelier's Terms of Service and Privacy Policy.
      </p>
    </form>
  );
};

export default RegisterForm;