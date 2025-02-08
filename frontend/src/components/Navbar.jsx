// eslint-disable-next-line no-unused-vars
import React from "react";
import { NavLink } from "react-router-dom";
import search from "../assets/search.png";
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
      </div>
    </div>
  );
};

export default Navbar;
