import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const { otpFor } = useParams();
  const location = useLocation();
  const { navigate, backendUrl } = useContext(ShopContext);
  const email = location.state?.email || "";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/verify?otpFor=${otpFor}`,
        {
          email,
          otp,
        }
      );

      if (res.data.result.valid) {
        toast.success("OTP verified!");
        if (otpFor === "password") {
          setTimeout(
            () => navigate("/resetPassword", { state: { email } }),
            2000
          );
        } else {
          setTimeout(() => navigate("/login", { state: { email } }), 2000);
        }
      } else {
        toast.error(res.data.result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (email === "") {
      navigate("/");
    }
  }, [email]);

  return (
    <div className="flex items-center justify-center">
      <div className=" p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-gray-700 mb-2">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 px-3 border border-gray-800 "
              placeholder="Enter the OTP"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
