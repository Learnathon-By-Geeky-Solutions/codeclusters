// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link, NavLink } from "react-router-dom";
import search from "../assets/search.png";
import profile from "../assets/userProfile.png";
import cart from "../assets/cart.png";
import menu from "../assets/menuIcon.png";
const Navbar = () => {
  return (
    <div className="flex  items-center justify-between  py-5 font-medium">
      <h4 className="font-serif text-xl underline decoration-wavy decoration-gray-700">
        Your Stationary
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
          <img src={profile} alt="" className="w-5 cursor-pointer" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col w-36 py-2 text-center bg-slate-100 text-gray-700">
              <p className="cursor-pointer hover:bg-gray-300 py-1">Profile</p>
              <p className="cursor-pointer hover:bg-gray-300 py-1">Orders</p>
              <p className="cursor-pointer hover:bg-gray-300 py-1">Logout</p>
            </div>
          </div>
        </div>
        <Link to="/cart" className="relative">
          <img src={cart} alt="" className="w-5 min-w-5 cursor-pointer" />
          <p className="absolute right-[-4px] bottom-[-4px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[7px]">
            10
          </p>
        </Link>
        <img src={menu} alt="" className="w-5 cursor-pointer sm:hidden" />
      </div>
    </div>
  );
};

export default Navbar;
