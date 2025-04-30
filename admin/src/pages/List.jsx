import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/bin_icon.png";
import EditProduct from "../components/EditProduct";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const [product, setProduct] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchList = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list?page=${currentPage}&limit=20`);
      if (res.data.success) {
        setList(res.data.products);
        setTotalPages(res.data.totalPages);
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

  const handleClick = (item) => {
    setShowUpdate(true);
    setProduct(item);
  };

  useEffect(() => {
    fetchList();
  }, [currentPage]);
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

        {list.map((item) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 gap-2 bg-gray-100 text-sm"
            key={item._id}
          >
            <img className="w-12" src={`${item.image[0]}`} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <div className="flex flex-row justify-evenly gap-2">
              <button
                onClick={() => removeProduct(item._id)}
                className="text-center text-white w-[15%] bg-red-500 md:text-center md:w-full cursor-pointer hover:bg-red-700  rounded-full text-xl "
              >
                <img className="w-6 h-6 m-auto p-1" src={deleteIcon} alt="" />
              </button>
              <button
                onClick={() => handleClick(item)}
                className="text-center w-[15%] bg-green-500 md:text-center md:w-full cursor-pointer hover:bg-red-700  rounded-full text-xl"
              >
                <img className="w-6 h-6 m-auto p-1" src={editIcon} alt="" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
      <EditProduct
        isOpen={showUpdate}
        onClose={() => setShowUpdate(false)}
        product={product}
        token={token}
      />
    </>
  );
};

export default List;
