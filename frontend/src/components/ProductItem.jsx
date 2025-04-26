/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const ProductItem = ({ id, image, name, price, sellingPrice, bestSeller }) => {
  const { currency } = useContext(ShopContext);
  const offPrice = ((price - sellingPrice) * 100) / price;

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={`${image[0]}`}
          alt=""
        />
      </div>
      <p className="flex flex-row gap-1 items-center pt-3 pb-1 text-sm">
        {" "}
        {name}
        {bestSeller === true ? (
          <img className="h-3 w-3" src={assets.best_seller} alt="" />
        ) : null}
      </p>
      <div className="text-sm font-medium">
        {currency}
        {sellingPrice && sellingPrice !== price ? sellingPrice : price}
        <div
          className={`text-[10px] flex flex-col font-medium text-red-500 ${
            sellingPrice && sellingPrice !== price ? "" : "hidden"
          }`}
        >
          <div className="flex flex-row justify-between gap-1">
            <del>
              {" "}
              {currency}
              {price}
            </del>
            <span className="text-[8px] text-green-700">
              {Math.ceil(offPrice)}% Off!! Save {currency}
              {price - sellingPrice}
              {" !"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
