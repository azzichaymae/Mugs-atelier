import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, termsAccepted } = formData;

    if (!name || !email || !password || !confirmPassword || !termsAccepted) {
      setError(
        "All fields are required, including agreeing to the Terms of Service."
      );
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    // You can handle the API call for user registration here.
    setSuccess("Registration successful!");
    setError("");
  };

  return (
    <section className="vh-100 mt-5 " style={{ backgroundColor: "#eee" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className=" h2 fw-bold mb-5 ">Register</p>

                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                      <div className="form-outline flex-fill mb-1">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control"
                        />
                        <div className="d-flex flex-row align-items-left mb-1">
                          <i className="fas fa-user fa-md me-1 fa-fw"></i>
                          <label htmlFor="name">Your Name</label>
                        </div>
                      </div>
                      <div className="form-outline flex-fill mb-1">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control"
                        />
                        <div className="d-flex flex-row align-items-left mb-1">
                          <i className="fas fa-envelope fa-md me-1 fa-fw"></i>
                          <label htmlFor="name">Your Email</label>
                        </div>
                      </div>
                      <div className="form-outline flex-fill mb-1">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="form-control"
                        />
                        <div className="d-flex flex-row align-items-left mb-1">
                          <i className="fas fa-lock fa-md me-1 fa-fw"></i>
                          <label htmlFor="name">Password</label>
                        </div>
                      </div>
                      <div className="form-outline flex-fill mb-1">
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="form-control"
                        />
                        <div className="d-flex flex-row align-items-left mb-2">
                          <i className="fas fa-key fa-md me-1 fa-fw"></i>
                          <label htmlFor="name">Repeat your password</label>
                        </div>
                      </div>

                      <div className="d-flex justify-content-center mx-4   ">
                        <button
                          style={{ backgroundColor: "rgb(255, 127, 80)" }}
                          type="submit"
                          className="btn btn-md text-white w-100"
                        >
                          Register
                        </button><br/>
                        
                      </div><p className="mt-3">
                Already have an account?{" "}
                <Link to="/login" className="fw-bold text-decoration-none" style={{ color: "#ff7f50" }}>
                  Login
                </Link>
              </p>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Sample image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
