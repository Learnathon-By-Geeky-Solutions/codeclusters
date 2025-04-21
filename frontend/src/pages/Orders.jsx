// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import OrderTrackingModal from "../components/OrderTrackingModal";

const Orders = () => {
  const { currency, token, backendUrl } = useContext(ShopContext);

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
  console.log(orderData);
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
            key={item._id}
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
                  Payment:{" "}
                  <span className="text-gray-400">{item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-between md:w-1/2">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={() => handleClick(item)}
                className="border px-4 py-2 text-sm font-medium rounded-sm"
              >
                Track Order
              </button>

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
