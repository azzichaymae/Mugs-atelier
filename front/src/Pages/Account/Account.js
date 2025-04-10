
import React from 'react';
import { UserIcon, MailIcon, PhoneIcon, LockClosedIcon } from '@heroicons/react/outline';

export default function AccountProfile() {
  return (
    <div className="min-h-screen bg-[#f5efe4] py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-serif text-center mb-2">My Account</h2>
        <p className="text-center text-gray-600 mb-6">
          Manage your account details, orders, addresses and wishlist
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          <button className="bg-[#f5efe4] px-4 py-2 rounded shadow-inner">Profile</button>
          <button className="text-gray-500 px-4 py-2 rounded">Orders</button>
          <button className="text-gray-500 px-4 py-2 rounded">Addresses</button>
          <button className="text-gray-500 px-4 py-2 rounded">Wishlist</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-[#dfccaa] w-28 h-28 rounded-full flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <button className="text-sm text-gray-600 bg-white px-2 py-1 rounded shadow">Change</button>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-gray-500">Member since April 2023</p>
          </div>

          {/* Right Panel */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">First Name</label>
                <input className='rounded' className="w-full border rounded px-3 py-2" defaultValue="John" />
              </div>
              <div>
                <label className="text-sm">Last Name</label>
                <input className='rounded' className="w-full border rounded px-3 py-2" defaultValue="Doe" />
              </div>
            </div>

            <div>
              <label className="text-sm flex items-center gap-2">
                <MailIcon className="w-4 h-4" /> Email
              </label>
              <input className='rounded' className="w-full border rounded px-3 py-2" defaultValue="john.doe@example.com" />
            </div>

            <div>
              <label className="text-sm flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" /> Phone Number
              </label>
              <input className='rounded' className="w-full border rounded px-3 py-2" defaultValue="+1 (555) 123-4567" />
            </div>

            <div>
              <label className="text-sm flex items-center gap-2 font-medium mt-4">
                <LockClosedIcon className="w-4 h-4" /> Change Password
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <input className='rounded' className="border rounded px-3 py-2" type="password" placeholder="Current Password" />
                <input className='rounded' className="border rounded px-3 py-2" type="password" placeholder="New Password" />
                <input className='rounded' className="border rounded px-3 py-2" type="password" placeholder="Confirm New Password" />
              </div>
            </div>

            <div className="text-right">
              <button className="bg-[#a5773d] text-white px-6 py-2 rounded hover:bg-[#8c642e]">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
