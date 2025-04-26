/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import parcel_icon from "../assets/parcel.png";
import dropdown_icon from "../assets/dropdown_icon.png";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [showCancelledOnly, setShowCancelledOnly] = useState(false);

  const toggleStatus = (e) => {
    const value = e.target.value;
    setStatus((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const togglePaymentMethod = (e) => {
    const value = e.target.value;
    setPaymentMethod((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };
  const togglePaymentStatus = (e) => {
    const value = e.target.value;
    setPaymentStatus((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };
  const fetchAllOrders = async (page = 1) => {
    if (!token) return null;

    try {
      const statusQuery =
        status.length > 0 ? `&status=${status.join(",")}` : "";
      const paymentMethodQuery =
        paymentMethod.length > 0
          ? `&paymentMethod=${paymentMethod.join(",")}`
          : "";
      const paymentStatusQuery =
        paymentStatus.length > 0
          ? `&paymentStatus=${paymentStatus.join(",")}`
          : "";
      const cancelledQuery = `&cancelled=${showCancelledOnly}`;
      const res = await axios.post(
        backendUrl +
          `/api/order/list?page=${page}&limit=20${statusQuery}${paymentMethodQuery}${paymentStatusQuery}${cancelledQuery}`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      } else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (status, orderId) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status },
        { headers: { token } }
      );
      if (res.data.success) {
        await fetchAllOrders(currentPage);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders(currentPage);
  }, [
    currentPage,
    token,
    status,
    paymentMethod,
    paymentStatus,
    showCancelledOnly,
  ]);
  Order.propTypes = {
    token: PropTypes.string.isRequired,
  };
  return (
    <div>
      <div className="min-w-60">
        <div className="flex flex-row gap-2 justify-between">
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS{" "}
            <img
              className={`h-3 sm:hidden ${showFilter ? "rotate-90 " : ""}`}
              src={dropdown_icon}
              alt=""
            />
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus([]);
              setPaymentMethod([]);
              setPaymentStatus([]);
              setShowCancelledOnly(false);
            }}
            className={`text-base rounded-full px-4 py-2 sm:px-7 sm:py-2  bg-gray-200 
               ${
                 status.length > 0 ||
                 paymentMethod.length > 0 ||
                 paymentStatus.length > 0
                   ? " "
                   : "hidden"
               }`}
          >
            All Orders
          </button>
          <button
            type="button"
            onClick={() => setShowCancelledOnly((prev) => !prev)}
            className={`text-base rounded-full px-4 py-2 sm:px-7 sm:py-2  ${
              showCancelledOnly ? "bg-green-700" : "bg-red-700"
            } text-white
               `}
          >
            {showCancelledOnly ? "Show All Products" : "View cancel request"}
          </button>
        </div>
        <div
          className={` border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Filter by status</p>
          <div className="flex flex-col sm:flex-row gap-2 text-sm font-light text-gray-700">
            {[
              "Order Placed",
              "Packing",
              "Shipped",
              "Out for delivery",
              "Delivered",
              "Cancelled",
            ].map((item) => (
              <label key={item} className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={item}
                  onChange={toggleStatus}
                  checked={status.includes(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div
            className={` border border-gray-300 pl-5  w-[50%] py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">Filter by Payment Method</p>
            <div className="flex flex-col sm:flex-row gap-2 text-sm font-light text-gray-700">
              {["Stripe", "COD"].map((item) => (
                <label key={item} className="flex gap-2">
                  <input
                    type="checkbox"
                    className="w-3"
                    value={item}
                    onChange={togglePaymentMethod}
                    checked={paymentMethod.includes(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div
            className={` border border-gray-300 pl-5 py-3 mt-6  w-[50%] ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">Filter by Payment Status</p>
            <div className="flex flex-col sm:flex-row gap-2 text-sm font-light text-gray-700">
              {["Done", "Pending"].map((item) => (
                <label key={item} className="flex gap-2">
                  <input
                    type="checkbox"
                    className="w-3"
                    value={item}
                    onChange={togglePaymentStatus}
                    checked={paymentStatus.includes(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      <h3>Order Page</h3>

      <div>
        {orders.map((order) => (
          <div
            className="grid gird-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] md:grid-cols-[0.5fr_2fr_1fr_.5fr_1fr] gap-3 items-start border border-gray-200 p-5 md:my-4 text-xs sm:text-sm text-gray-700"
            key={order._id}
          >
            <img className="w-12" src={parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return (
                      <p className="py-0.5" key={item._id}>
                        {item.name} x {item.quantity} <span>{item.size}</span>
                      </p>
                    );
                  } else {
                    return (
                      <p className="py-0.5" key={item._id}>
                        {item.name} x {item.quantity} <span>{item.size},</span>
                      </p>
                    );
                  }
                })}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {" "}
                {order.address.firstName + " " + order.address.lastName}{" "}
              </p>

              <div>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p>{order.address.email}</p>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items: {order.items.length}
              </p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm  sm:text-[15px]">
              {" "}
              {currency}
              {order.amount}{" "}
            </p>
            <div className="flex flex-col gap-2">
              <select
                onChange={(e) => statusHandler(e.target.value, order._id)}
                value={order.status}
                className="p-2 font-semibold"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {order.cancelled && (
                <>
                  {order.status !== "Cancelled" ? (
                    <>
                      <button
                        onClick={() => statusHandler("Cancelled", order._id)}
                        className="border px-4 py-2 text-sm text-red-500 font-medium rounded-sm hover:text-white hover:bg-red-500"
                      >
                        Cancel Order
                      </button>
                      <span className="text-red-500 text-xs">
                        Customer has requested to cancel the order
                      </span>
                    </>
                  ) : (
                    <span className="text-red-500 text-xs">
                      Order has cancelled
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
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
      </div>
    </div>
  );
};

export default Order;
