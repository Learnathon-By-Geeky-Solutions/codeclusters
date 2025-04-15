/* eslint-disable react/prop-types */

import { assets } from "../assets/assets";

const Profile = ({ isOpen, onClose, name, email }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={
                name
                  ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      name
                    )}`
                  : assets.profile_icon
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-gray-600">Name:</p>
            <p className="text-gray-800">{name || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="text-gray-800">{email || "Not provided"}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Profile;
