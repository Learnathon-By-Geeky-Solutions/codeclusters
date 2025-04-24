import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import BeatLoader from "react-spinners/BeatLoader";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { navigate, backendUrl, token } = useContext(ShopContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(backendUrl + "/api/user/forgotPassword", {
        email,
      });

      console.log(res);
      if (res.data.success) {
        toast.success("OTP sent to your email!");

        setTimeout(() => {
          navigate("/verifyOtp/password", { state: { email } });
        }, 500);
        setLoading(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center">
      <div className="p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-800"
              placeholder="Enter your email"
              required
              id="email"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? <BeatLoader color="#ffffff" size={8} /> : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
