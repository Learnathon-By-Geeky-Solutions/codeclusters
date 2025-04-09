// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const PlaceOrder = () => {
  const {
    navigate,
    cartItems,
    backendUrl,
    token,
    setCartItems,
    getCartAmount,
    deliver_fee,
    products,
  } = useContext(ShopContext);
  const { user } = useContext(UserContext);
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (Object.keys(cartItems).length === 0) {
      navigate("/cart");
    }
  }, []);
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const buildOrderItems = (cartItems, products) => {
    const orderItems = [];
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          const product = structuredClone(
            products.find((p) => p._id === productId)
          );
          if (product) {
            product.size = size;
            product.quantity = cartItems[productId][size];
            orderItems.push(product);
          }
        }
      }
    }
    return orderItems;
  };
  const placeCODOrder = async (orderData, token) => {
    const res = await axios.post(backendUrl + "/api/order/place", orderData, {
      headers: { token },
    });
    return res.data;
  };

  const placeStripeOrder = async (orderData, token) => {
    const res = await axios.post(backendUrl + "/api/order/stripe", orderData, {
      headers: { token },
    });
    return res.data;
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const orderItems = buildOrderItems(cartItems, products);
      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + deliver_fee,
      };

      let response;
      if (method === "cod") {
        response = await placeCODOrder(orderData, token);
      } else if (method === "stripe") {
        response = await placeStripeOrder(orderData, token);
      }

      if (response?.success) {
        if (method === "stripe") {
          window.location.replace(response.session_url);
        } else {
          setCartItems({});
          navigate("/orders");
        }
      } else {
        toast.error(response?.message || "Unknown error");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className=" flex flex-col sm:flex-row justify-between gap-4 sm:pt-14 pt-5 min-h-[80vh] border-t"
    >
      {/**Left Side form */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First Name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="Email"
          placeholder="Email"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="Text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zip Code"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>

      {/**Right side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <button
              type="button"
              onClick={() => setMethod("stripe")}
              className="hover:bg-gray-100 flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img
                className="h-8
               mx-4"
                src={assets.stripe_logo}
                alt=""
              />
            </button>
            <button
              type="button"
              onClick={() => setMethod("ssl")}
              className="hover:bg-gray-100 flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "ssl" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-8 mx-4" src={assets.ssl_logo} alt="" />
            </button>
            <button
              type="button"
              onClick={() => setMethod("cod")}
              className="hover:bg-gray-100 flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className=" text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </button>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black hover:bg-gray-700 text-white text-sm px-16 py-3"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
