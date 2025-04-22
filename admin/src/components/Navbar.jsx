import React, { useState } from "react";
import logo from "../assets/logo.png";
import PropTypes from "prop-types";
import ChangePassword from "./ChangePassword";

const Navbar = ({ setToken, token }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  Navbar.propTypes = {
    setToken: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  };
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img className="w-[max(5%,20px)] " src={logo} alt="" />
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowChangePassword(true)}
          className="bg-gray-100 hover:text-white  text-gray-700 border border-dashed border-zinc-500 px-4 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
        >
          Change Password
        </button>
        <button
          onClick={() => setToken("")}
          className="bg-gray-600  text-white px-4 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
        >
          Logout
        </button>
      </div>
      <ChangePassword
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        token={token || " "}
      />
    </div>
  );
};

export default Navbar;
