import React from "react";
import { NavLink } from "react-router-dom";
import add from "../assets/add.png";
import order from "../assets/checkout.png";
import list from "../assets/schedule.png";
const Sidebar = () => {
  return (
    <nav className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1"
          to="/add"
          aria-label="Add Items"
        >
          <img className="w-5 h-5" src={add} alt="Add items icon" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1"
          to="/list"
          aria-label="List Items"
        >
          <img className="w-5 h-5" src={list} alt="List items icon" />
          <p className="hidden md:block">List Items</p>
        </NavLink>
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1"
          to="/order"
          aria-label="Orders"
        >
          <img className="w-5 h-5" src={order} alt="Orders icon" />
          <p className="hidden md:block">Orders</p>
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
