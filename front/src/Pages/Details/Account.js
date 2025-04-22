import React, { useEffect, useState } from "react";
import "./AccountPage.css";
import { useNavigate } from "react-router";
import Addresses from "./Addresses";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import Profile from "./Profile";
const AccountPage = () => {
  const changeTab = (e) => {
    const id = e.target.id;
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    const activeTab = document.getElementById(id);
    activeTab.classList.add("active");

    // const tabContents = document.querySelectorAll(".tab-content");
    // tabContents.forEach((tab) => {
    //   tab.classList.add('hidden');
    // });
    // const activeTabContent = document.getElementById(id + "-content");
    // activeTabContent.style.display = "block";

    const tabContents = document.querySelectorAll(".tab-content"); // Replace .tab-content with the class name for your tab contents

    tabContents.forEach((tab) => {
      if (tab.id == id + "-content") {
        tab.classList.remove("hidden");
        tab.style.display = "block";
      } else {
        tab.classList.add("hidden");
      }
    });
  };

  return (
    <div className="account-page">
      <div className="list-div">
        <div className="list-group list-group-horizontal">
          <button onClick={changeTab} id="profile" className="tab active">
            Profile
          </button>
          <button onClick={changeTab} id="orders" className="tab">
            Orders
          </button>
          <button onClick={changeTab} id="adresses" className="tab">
            Addresses
          </button>
          <button onClick={changeTab} id="wishlist" className="tab">
            Wishlist
          </button>
        </div>
      </div>
     <div className="d-flex justify-content-center align-items-center flex-column">
      
        <div className="card card-item ">
          <Profile />
          <Addresses />
          <Orders />
          <Wishlist />
        </div>
      
     </div>
    </div>
  );
};

export default AccountPage;
