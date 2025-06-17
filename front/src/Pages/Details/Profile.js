import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';


const Profile = () => {
  const [error, setError] = useState("");
  const [displayFirstName, setDisplayFirstName] = useState("");
  const [displayLastName, setDisplayLastName] = useState("");
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\+?\d{10,15}$/, "Invalid phone number (10-15 digits required)")
      .required("Phone number is required"),
    currentPassword: Yup.string().test(
      "password-requirement",
      "Current password is required if changing password",
      function (value) {
        const { newPassword, confirmNewPassword } = this.parent;
        if (newPassword || confirmNewPassword) {
          return !!value;
        }
        return true;
      }
    ),
    newPassword: Yup.string().test(
      "new-password-requirement",
      "New password must be at least 8 characters if provided",
      function (value) {
        const { currentPassword, confirmNewPassword } = this.parent;
        if (currentPassword || confirmNewPassword) {
          return value && value.length >= 8;
        }
        return true;
      }
    ),
    confirmNewPassword: Yup.string().test(
      "confirm-password-requirement",
      "Passwords must match if changing password",
      function (value) {
        const { currentPassword, newPassword } = this.parent;
        if (currentPassword || newPassword) {
          return value === newPassword;
        }
        return true;
      }
    ),
  });

  const fetchUserById = async () => {
    try {
      const id = localStorage.getItem("user_id");
      if (!id) {
        setError("User ID not found. Please log in.");
        navigate("/login");
        return;
      }
      const response = await fetch(`http://127.0.0.1:8000/find/${id}/`);
      if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
      const data = await response.json();
      const firstName = data.name.split(" ")[0] || "";
      const lastName = data.name.split(" ")[1] || "";
      setDisplayFirstName(firstName);
      setDisplayLastName(lastName);
      formik.setValues({
        firstName,
        lastName,
        email: data.email || "",
        phone: data.phone_number || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      setError("Failed to fetch user data. Please try again.");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
    } else {
      fetchUserById();
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      const userId = localStorage.getItem("user_id");

      if (!formik.isValid) {
        return;
      }

      try {
        const updateData = {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          phone_number: values.phone,
          ...(values.currentPassword &&
            values.newPassword && { current_password: values.currentPassword, new_password: values.newPassword }),
        };

        const userResponse = await fetch(`http://127.0.0.1:8000/update/${userId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        const responseData = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(responseData.error || `Failed to update user: ${userResponse.status}`);
        }

        if (responseData.message === "User updated successfully") {
          setDisplayFirstName(values.firstName);
          setDisplayLastName(values.lastName);
          toast.success("Profile updated successfully!", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
          });
          formik.setValues({
            ...values,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
          await fetchUserById();
        } else {
          throw new Error(responseData.error || "Unexpected response from server");
        }
      } catch (error) {
        setError(error.message || "Failed to update profile. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const deconnect = () => {
   Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out!',
        icon: 'warning',
        width: '300px',  
        padding: '0.8rem',
        showCancelButton: true,
       
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
        customClass: {
            confirmButton: 'btn btn-md  btn-success',
            cancelButton: 'btn btn-md btn-secondary',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            formik.resetForm();
            localStorage.removeItem("user_id");
            navigate("/login");
        }
    });

  };

  return (
    <div id="profile-content" className="profile-card full-width tab-content flex flex-col md:flex-row">
      <div className="sidebar md:w-1/12 p-4">
        {error && (
          <div className="error-msg text-red-500 text-sm mb-2 text-center">
            {error}
          </div>
        )}
        <ToastContainer />
        <div className="avatar mx-auto w-16 h-16 md:w-20 md:h-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="rounded-full object-cover object-center w-full h-full"
          >
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304h-91.4z" />
          </svg>
        </div>
        <p className="name text-center mt-2 text-xs md:text-sm">
          {displayFirstName} {displayLastName}
        </p>
        <i
          onClick={deconnect}
          className="fa fa-solid fa-right-from-bracket cursor-pointer text-center block mt-2 mx-auto text-base"
        ></i>
      </div>
      <div className="w-full md:w-11/12 p-4 md:p-6">
        <h1 className="text-lg md:text-xl mb-3 flex items-center">
          <i className="fa fa-solid fa-circle-info mr-2"></i>
          Account Information
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`block w-full rounded-lg border-2 ${
                  formik.touched.firstName && formik.errors.firstName
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-600"
                } bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200`}
                placeholder="Enter first name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`block w-full rounded-lg border-2 ${
                  formik.touched.lastName && formik.errors.lastName
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-600"
                } bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200`}
                placeholder="Enter last name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-envelope text-gray-400 text-sm"></i>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                className={`block w-full rounded-lg border-2 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-600"
                } bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200`}
                placeholder="Enter email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-phone text-gray-400 text-sm"></i>
              </div>
              <input
                type="text"
                id="phone"
                name="phone"
                className={`block w-full rounded-lg border-2 ${
                  formik.touched.phone && formik.errors.phone
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-600"
                } bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200`}
                placeholder="Enter phone number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
            )}
          </div>
          <hr className="my-4" />
          <div className="mb-4">
            <h2 className="text-base md:text-lg font-medium text-gray-700 flex items-center">
              <i className="fas fa-lock mr-2"></i> Change Password
            </h2>
          </div>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              className={`block w-full rounded-lg border-2 ${
                formik.touched.currentPassword && formik.errors.currentPassword
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-indigo-600"
              } bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200`}
              placeholder="Enter current password"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.currentPassword && formik.errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.currentPassword}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className={`block w-full rounded-lg border-2 ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-600"
                } bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200`}
                placeholder="Enter new password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.newPassword}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                className={`block w-full rounded-lg border-2 ${
                  formik.touched.confirmNewPassword && formik.errors.confirmNewPassword
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-600"
                } bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-colors duration-200`}
                placeholder="Confirm new password"
                value={formik.values.confirmNewPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.confirmNewPassword}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => formik.resetForm()}
className="deconnect-btn bg-brown-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"            >
              Discard
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
              className={`save-btn bg-brown-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500 ${
                formik.isSubmitting || !formik.isValid || !formik.dirty ? "opacity-50 cursor-not-allowed" : ""
              }`}
            
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;