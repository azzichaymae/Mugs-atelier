import React, { useState } from "react";

const LoginForm = ({action, setAction, email, setEmail, password, setPassword, errorLog, errorEmail, errorPassword, handleLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-3 text-sm font-normal" onSubmit={handleLogin}>
      <div>
        <label className="block text-sm mb-1" htmlFor="email">
          Email
        </label>
        <div className="flex items-center border border-[#C49A6C] rounded-md px-3 py-2 text-[#A67C52]">
          <i className="fas fa-envelope mr-2"></i>
          <input
            className="w-full bg-transparent outline-none placeholder:text-[#A67C52] text-[#6B3F1A]"
            id="email"
            name="email"
            placeholder="your@email.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {errorEmail && <p className="text-xs text-red-500 mt-1">{errorEmail}</p>}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm" htmlFor="password">
            Password
          </label>
          <a className="text-xs text-[#A67C52] hover:underline" href="#">
            Forgot password?
          </a>
        </div>
        <div className="flex items-center justify-between border border-[#C49A6C] rounded-md px-3 py-2 text-[#A67C52]">
          <div className="flex items-center space-x-2">
            <i className="fas fa-lock"></i>
            <input
              className="bg-transparent outline-none placeholder:text-[#A67C52] text-[#6B3F1A]"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            aria-label="Toggle password visibility"
            className="text-[#A67C52]"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
          </button>
        </div>
        {errorPassword && <p className="text-xs text-red-500 mt-1">{errorPassword}</p>}
      </div>
      {errorLog && <p className="text-xs text-red-500 text-center">{errorLog}</p>}
      <button
        className="w-full bg-[#6B3F1A] text-white py-2 rounded-md text-sm font-normal"
        type="submit"
      >
        Sign In
      </button>
      <p className="text-center text-xs">
        Don't have an account?{' '}
        <a className="font-semibold hover:underline" onClick={()=> setAction("register")}>
          Sign up now
        </a>
      </p>
      <hr className="border-[#D9D1C7] my-6" />
      <p className="text-center text-xs text-[#A67C52]">
        By continuing, you agree to Mugs' Atelier's Terms of Service and Privacy Policy.
      </p>
    </form>
  );
};

export default LoginForm;