// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import OrderTrackingModal from "../components/OrderTrackingModal";

const Orders = () => {
  const { currency, token, backendUrl, deliver_fee } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const res = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        let allOrdersItems = [];
        res.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            item["orderId"] = order._id;
            item["cancelled"] = order.cancelled;
            allOrdersItems.push(item);
          });
        });
        setOrderData(allOrdersItems.toReversed());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const handleClick = async (item) => {
    loadOrderData();
    setSelectedOrder(item);
  };
  const placeStripeOrder = async (orderData, token) => {
    const res = await axios.post(
      backendUrl + "/api/order/makePaymentStripe",
      orderData,
      {
        headers: { token },
      }
    );
    return res.data;
  };
  const handlePayment = async (item) => {
    const paymentData = {
      orderId: item.orderId,
      item: item,
      amount: item.sellingPrice + deliver_fee,
    };
    let response;

    response = await placeStripeOrder(paymentData, token);
    if (response?.success) {
      window.location.replace(response.session_url);
    } else {
      toast.error(response?.message || "Unknown error");
    }
  };

  const handleCancel = async (item) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/order/cancelOrder",
        { orderId: item.orderId },
        { headers: { token } }
      );
      if (res.data.success) {
        await loadOrderData();
        toast.info(res.data.message);
      } else toast.warning(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orderData.map((item) => (
          <div
            key={item.orderId}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img
                src={`${backendUrl}/${item.image[0].replace(/\\/g, "/")}`}
                className="w-16 sm:w-20"
                alt=""
              />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray700">
                  <p>
                    {currency}
                    {item.sellingPrice}
                  </p>
                  <p>Quantity:{item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="mt-1">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1">
                  Payment Method:{" "}
                  <span className="text-gray-400">{item.paymentMethod}</span>
                </p>
                <p className="mt-1">
                  Payment:{" "}
                  <span className="text-gray-400">
                    {item.payment ? "Done" : "Pending"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-between md:w-1/2">
              <div className="flex items-center gap-2">
                <p
                  className={`min-w-2 h-2 rounded-full ${
                    item.status == "Cancelled" ? "bg-red-500" : "bg-green-500"
                  }`}
                ></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              {!item.payment &&
                !item.cancelled &&
                item.paymentMethod === "Stripe" && (
                  <button
                    onClick={() => handlePayment(item)}
                    className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-green-800 hover:text-white"
                  >
                    Make Payment
                  </button>
                )}
              {item.cancelled ? (
                <span className="text-red-500 text-sm">
                  {item.status == "Cancelled"
                    ? "Order Cancelled "
                    : "Order Cancellation is in progress"}
                </span>
              ) : (
                (item.status == "Order Placed" || item.status == "Packing") && (
                  <button
                    onClick={() => handleCancel(item)}
                    className="border px-4 py-2 text-sm font-medium rounded-sm  hover:bg-red-500 hover:text-white"
                    disabled={item.cancelled}
                  >
                    Cancel Order
                  </button>
                )
              )}
              {item.status !== "Cancelled" && (
                <button
                  onClick={() => handleClick(item)}
                  className="border px-4 py-2 text-sm font-medium  hover:bg-teal-500 hover:text-white rounded-sm"
                >
                  Track Order
                </button>
              )}

              {selectedOrder && (
                <OrderTrackingModal
                  order={selectedOrder}
                  onClose={() => setSelectedOrder(null)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
