/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

//not secured. have to use webHook
const VerifyPayment = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);
  const verifyPayment = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/order/verifyStripe",
        { success, orderId },
        { headers: { token } }
      );
      if (res.data.success) {
        setLoading(false);
        setCartItems({});
        navigate("/orders");
      } else navigate("/cart");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token]);
  return (
    <div className="flex justify-center">
      <h4>Verifying your payment...</h4>
      <HashLoader loading={loading} />
    </div>
  );
};

export default VerifyPayment;
