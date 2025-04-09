/* eslint-disable no-unused-vars */

import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import Profile from "./Profile";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);
  const { user, setUser } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken("");
    setCartItems({});
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex  items-center justify-between  py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} alt="" className="w-16" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-3/4 border-none h-[1.7px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/Collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-3/4 border-none h-[1.7px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-3/4 border-none h-[1.7px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-3/4 border-none h-[1.7px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex item-center gap-6">
        <Link to="/Collection" onClick={() => setShowSearch(true)}>
          {" "}
          <img src={assets.search_icon} alt="" className="w-5 cursor-pointer" />
        </Link>

        <div className="group relative">
          {/* <Link to="/login"> */}{" "}
          <button
            type="button"
            onClick={() => (token ? null : navigate("/login"))}
            className="p-0 border-none bg-transparent"
          >
            <img
              src={
                user?.name
                  ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}`
                  : assets.profile_icon
              }
              alt=""
              className={`w-5 cursor-pointer ${
                user?.name ? "rounded-full" : " "
              }`}
            />
          </button>
          {/* </Link> */}
          {/**DropDOwn */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col w-36 py-2 text-center bg-slate-100 text-gray-700">
                <button
                  type="button"
                  onClick={() => setShowProfile(true)}
                  className="cursor-pointer hover:bg-gray-300 py-1 bg-transparent border-none w-full"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate("/orders")}
                  type="button"
                  className="cursor-pointer hover:bg-gray-300 py-1 bg-transparent border-none w-full"
                >
                  Orders
                </button>
                <button
                  onClick={logout}
                  type="button"
                  className="cursor-pointer hover:bg-gray-300 py-1 bg-transparent border-none w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon}
            alt=""
            className="w-5 min-w-5 cursor-pointer"
          />
          <p className="absolute right-[-2px] bottom-[-2px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[7px]">
            {getCartCount()}
          </p>
        </Link>
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="p-0 border-none bg-transparent sm:hidden"
        >
          <img
            src={assets.menu_icon}
            alt=""
            className="w-5 cursor-pointer sm:hidden"
          />
        </button>
      </div>

      {/* Profile Modal Component */}
      <Profile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        name={user?.name}
        email={user?.email}
      />
      {/*Sidebar menu*/}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div className="flex items-center gap-4 p-3 cursor-pointer">
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="p-0 border-none bg-transparent flex items-center gap-4 w-full"
            >
              <img
                className="h-4 rotate-180"
                src={assets.dropdown_icon}
                alt="Go Back"
              />
              <span>Back</span>
            </button>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
