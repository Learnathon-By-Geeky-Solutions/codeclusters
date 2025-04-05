import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/product/list");
      if (res.data.success) {
        console.log(res.data.products);
        setList(res.data.products);
      } else toast.error(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchList();
      } else toast.error(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  List.propTypes = {
    token: PropTypes.string.isRequired,
  };
  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className=" flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2  border-b-2 border-b-teal-700 bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 gap-2 bg-gray-100 text-sm"
            key={index}
          >
            <img
              className="w-12"
              src={`${backendUrl}/${item.image[0].replace(/\\/g, "/")}`}
              alt=""
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <p
              onClick={() => removeProduct(item._id)}
              className="text-center text-white w-[25%] bg-gray-700 md:text-center md:w-full cursor-pointer hover:bg-red-700 md:text-white px-4 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
