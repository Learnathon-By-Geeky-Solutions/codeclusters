/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { searchQuery, setSearchQuery, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("Collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);
  return showSearch && visible ? (
    <div className="border-t py-4 border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 mx-3 rounded-full w-3/4 sm:1/2">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="search"
        />
        <img className="w-4" src={assets.search_icon} alt="" />
      </div>
      <button
        className="p-0 border-none bg-transparent"
        type="button"
        onClick={() => setShowSearch(false)}
      >
        <img
          className="inline w-3 cursor-pointer"
          src={assets.cross_icon}
          alt=""
        />
      </button>
    </div>
  ) : null;
};

export default SearchBar;
