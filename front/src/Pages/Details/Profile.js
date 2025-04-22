import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router";const Profile = () => {
     const [firstName, setFn] = useState("");
  const [name,setName] = useState("");
  const [lastName, setLn] = useState("");
  const [email, setEm] = useState("");
  const [phone, setPh] = useState("");
  //   const [address, setAd] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");

  const fetchUserById = async () => {
    try {
      const id = localStorage.getItem("user_id");
      const response = await fetch(`http://127.0.0.1:8000/find/${id}/`);
      const data = await response.json();
      console.log(data);
	 setName(data.name)
      setFn(data.name.split(" ")[0]);
      setLn(data.name.split(" ")[1]);
      setEm(data.email);
      setPh(data.phone_number);

      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    fetchUserById();
  }, []);
  const navigate = useNavigate();
  const deconnect = () => {
    if(window.confirm("are you sure you want to logout ? ")){
      localStorage.removeItem("user_id");
     navigate("/login");
    }
     
   };
   useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      navigate("/login");
    }
  }, []);
 
   const changeFn = (e)=>{
      setFn(e.target.value)
      
   }
   const changeLn = (e)=>{
      setLn(e.target.value)
      }
      const changeEm = (e)=>{
           setEm(e.target.value)
      }
      const changePh = (e)=>{
           setPh(e.target.value)
 
      }
     return (
          <div id="profile-content" className="profile-card full-width tab-content d-flex "  >
          <div className="sidebar col-2 ">
          <div className="avatar">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 450 515"
    style={{ width: "100px", height: "90px" }} // Adjust size here
  >
    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
  </svg>
</div>
            <p className="name">{name}</p> <i onClick={deconnect} class="fa fa-solid fa-right-from-bracket"></i>
		  
            
          </div>
          <div class=" rounded-lg col-9">
          <h1 class="text-xl mb-3">
          <i class="fa fa-solid fa-circle-info mr-2"></i>
     Account Informations
    </h1>
            <div class="grid grid-cols-2 gap-4 ">
              <div>
    
                <label
                  for="first-name"
                  class="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={firstName}
			   onChange={changeFn}
                />
              </div>
              <div>
                <label
                  for="last-name"
                  class="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			   value={lastName}
			   onChange={changeLn}
                />
              </div>
            </div>
            <div class="mb-6">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			   value={email}
			   onChange={changeEm}
                />
              </div>
            </div>
            <div class="mb-6">
              <label
                for="phone-number"
                class="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-phone text-gray-400"></i>
                </div>
                <input
                  type="text"
                  id="phone-number"
                  class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			   value={phone}
			   onChange={changePh}
                />
              </div>
            </div>
            <hr class="my-6" />
            <div class="mb-6">
              <h2 class="text-lg font-medium text-gray-700 flex items-center">
                <i class="fas fa-lock mr-2"></i> Change Password
              </h2>
            </div>
            <div class="mb-6">
              <label
                for="current-password"
                class="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  for="new-password"
                  class="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  for="confirm-new-password"
                  class="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-new-password"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div class="flex justify-end">
		  <button className="deconnect-btn text-white py-2 px-4 rounded-md shadow-sm hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500">
                Discard
              </button>
              <button className="save-btn text-white py-2 px-4 rounded-md shadow-sm hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500">
                Save 
              </button>
            </div>
          </div>
        </div>
     )
}
export default Profile;