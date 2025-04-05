import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { navigate, backendUrl } = useContext(ShopContext);
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be greater than 8 character");
      return;
    }

    if (newPassword === confirmNewPassword) {
      try {
        const res = await axios.post(backendUrl + "/api/user/resetPassword", {
          email,
          newPassword,
        });

        if (res.data.success) {
          toast.success(res.data.message);
          setTimeout(() => navigate("/login", { state: { email } }), 2000);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else toast.error("Password doesn't match");
  };

  useEffect(() => {
    if (email === "") {
      navigate("/");
    }
  }, [email]);

  return (
    <div className="flex items-center justify-center">
      <div className=" p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 px-3 border border-gray-800 "
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmNewPassword"
              className="block text-gray-700 mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-2 px-3 border border-gray-800 "
              placeholder="Enter new password again"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
