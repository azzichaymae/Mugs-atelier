import React from 'react';
import './AccountPage.css';

const AccountPage = () => {
	const changeTab = (e) => {
		const id = e.target.id ;
		const tabs = document.querySelectorAll('.tab');
		tabs.forEach((tab) => {
			tab.classList.remove('active');
			});
			const activeTab = document.getElementById(id);
			activeTab.classList.add('active');
			};
			
	
  return (
    

	<div className="account-page">
	
    <div className='list-div'>
	<div className="list-group list-group-horizontal">
	  <button onClick={changeTab} id='profile' className="tab active">Profile</button>
	  <button onClick={changeTab} id='orders' className="tab">Orders</button>
	  <button onClick={changeTab} id='adresse' className="tab">Addresses</button>
	  <button onClick={changeTab} id='wishlist' className="tab">Wishlist</button>
	</div>
    </div>
	
<div className='card'>
    <div className="profile-card">
	  <div className="sidebar">
	    <div className="avatar"></div>
	    <button className="change-btn">Change</button>
	    <p className="name">user</p>
	    <p className="member-since">Member since April 2023</p>
	  </div>

	  <div className="profile-info">
	    <div className="field-group">
		 <label>First Name</label>
		 <input className='rounded' type="text" value="" />
	    </div>

	    <div className="field-group">
		 <label>Last Name</label>
		 <input className='rounded' type="text" value="" />
	    </div>

	    <div className="field-group full-width">
		 <label>Email</label>
		 <input className='rounded' type="email" value="" />
	    </div>

	    <div className="field-group full-width">
		 <label>Phone Number</label>
		 <input className='rounded' type="tel" value="" />
	    </div>
	   <h6 > <i className="fa fa-lock" aria-hidden="true"></i> Change Password</h6>

	    <div className="field-group full-width">
		 <label>Current Password</label>
		 <input className='rounded' type="password" />
	    </div>

	    <div className="field-group">
		 <label>New Password</label>
		 <input className='rounded' type="password" />
	    </div>

	    <div className="field-group">
		 <label>Confirm New Password</label>
		 <input className='rounded' type="password" />
	    </div>
	    <div className="field-group full-width btns mb-2">
		<span>
	    <button className="btn deconnect-btn text-white ">Deconnexion</button>
	    <button className="btn save-btn text-white">Save Changes</button></span>
	    </div>
	 
	</div></div>
</div>
	
   </div>


  );
};

export default AccountPage;
