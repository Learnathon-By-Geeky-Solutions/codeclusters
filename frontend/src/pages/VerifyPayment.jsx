/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token]);
  return (
    <>
      {loading && (
        <div className="flex justify-center items-center w-full">
          <h4>Verifying your payment...</h4>
        </div>
      )}
    </>
  );
};

export default VerifyPayment;
