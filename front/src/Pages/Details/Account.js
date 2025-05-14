import React, { useState } from "react";
import "./AccountPage.css";
import Addresses from "./Addresses";
import Orders from "./Orders";
import Wishlist from "./Wishlist";
import Profile from "./Profile";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", component: <Profile /> },
    { id: "orders", label: "Orders", component: <Orders /> },
    { id: "addresses", label: "Addresses", component: <Addresses /> },
    { id: "wishlist", label: "Wishlist", component: <Wishlist /> },
  ];

  return (
    <div className="account-page">
      <div className="list-div">
        <div className="list-group list-group-horizontal">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="card card-item">
          <div className="tab-content" id={`${activeTab}-content`}>
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;