import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";
import { useFormik } from "formik";

const Login=()=>{

  const formik = useFormik({
    initialValues: {
      email : '',
      password: ''
    },
    onSubmit: async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
  
        const formData = new FormData();
        formData.append("password", formik.values.password);
        formData.append("email", formik.values.email);
  
        const logindata = {
          password: formik.values.password,
          email: formik.values.email,
        };
  
        const loginResponse = await axios.post(
          "https://api.faragroupe.fr/api/login",
          logindata
        );
  
        
        const data = loginResponse.data;
        const token = data.token;
  
        if (data.ERROR) {
          alert("Connexion erronée")
          console.log(data.ERROR);
        } else {
          const userInfoResponse = await axios.get(
            "https://api.faragroupe.fr/api/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          localStorage.setItem(
            "user-info",
            JSON.stringify(userInfoResponse.data)
          );
  
          history({
            pathname: `/profile/${userInfoResponse.data.id}`,
          });
        }
      } catch (error) {
        alert("Connexion erronée")
      } finally {
        setLoading(false);
      }
    },
  });
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
     return(
          
      <section className="login-section d-flex align-items-center min-vh-100" style={{ background: "linear-gradient(to right,rgb(255, 207, 149), #fad0c4)" }}>
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="card shadow-lg border-0" style={{ borderRadius: "15px", backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
          <div className="card-body p-5 text-center">
            <h3 className="fw-bold mb-4" style={{ letterSpacing: "1px", color: "#333" }}>
              Welcome Back!
            </h3>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="form-control rounded-pill"
                  required
                />
                <label className="form-label d-flex justify-content-left">E-mail</label>
              </div>
              <div className="form-outline mb-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  className="form-control rounded-pill"
                  required
                />
                <label className="form-label d-flex justify-content-left">Password</label>
              </div>
              <button
                className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm"
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#ff7f50", border: "none" }}
              >
                {loading ? (
                  <RotatingLines width="24" strokeColor="white" strokeWidth="5" animationDuration="0.75" />
                ) : (
                  "Login"
                )}
              </button>
              <p className="mt-3">
                Don't have an account?{" "}
                <Link to="/register" className="fw-bold text-decoration-none" style={{ color: "#ff7f50" }}>
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

     )
}
export default Login;