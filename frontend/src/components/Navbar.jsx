// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link, NavLink } from "react-router-dom";
import search from "../assets/search.png";
import profile from "../assets/profile.png";
import cart_icon from "../assets/cart_icon.png";
const Navbar = () => {
  return (
    <div className="flex  items-center justify-between  py-5  font-medium">
      <h4 className="font-serif text-xl underline decoration-wavy decoration-gray-700">
        YOUR STATIONARY
      </h4>
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
        <img src={search} alt="" className="w-5 cursor-pointer" />
        <div className="group relative">
          <img className="w-6 cursor-pointer" src={profile} alt="" />
          <div className="group-hover:block hidden absolute right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>
        <Link to="/cart" className="relative">
          <img src={cart_icon} alt="" className="w-6 min-w-6 cursor-pointer" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leadind-4 bg-black text-white aspect-square text-[8px] rounded-full">10</p>
        </Link>

      </div>
    </div>
  );
};

export default Navbar;
