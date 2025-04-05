import React from "react";
import logo from "../assets/logo.png";
import PropTypes from "prop-types";

const Navbar = ({ setToken }) => {
  Navbar.propTypes = {
    setToken: PropTypes.string.isRequired,
  };
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img className="w-[max(5%,20px)] " src={logo} alt="" />
      <button
        onClick={() => setToken("")}
        className="bg-gray-600  text-white px-4 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
