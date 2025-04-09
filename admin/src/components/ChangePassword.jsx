import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import PropTypes from "prop-types";

// PasswordInput component with prop validation
const PasswordInput = ({ id, value, onChange, placeholder }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 mb-2">
        {placeholder}
      </label>
      <input
        type="password"
        id={id}
        value={value}
        onChange={onChange}
        className="w-full p-2 px-3 border border-gray-800"
        placeholder={placeholder}
        required
      />
    </div>
  );
};

PasswordInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

// ChangePassword component with prop validation
const ChangePassword = ({ isOpen, onClose, token }) => {
  ChangePassword.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be greater than 8 characters");
      return;
    }

    if (newPassword === confirmNewPassword) {
      try {
        const res = await axios.post(
          backendUrl + "/api/user/admin/changePassword",
          { currentPassword, newPassword },
          { headers: { token } }
        );

        if (res.data.success) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else toast.error("Passwords don't match");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <PasswordInput
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <PasswordInput
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            Change Password
          </button>
        </form>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
