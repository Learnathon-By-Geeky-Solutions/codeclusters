// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
const Login = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("prev-page");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const password = e.target.password.value;

    try {
      const res = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });
      setLoading(false);
      if (res.data.success) {
        setUser(res.data);

        localStorage.setItem("token", res.data.token);

        setToken(res.data.token);
      } else {
        toast.error(res.data.message);
        if (!res.data.emailVerified) {
          const emailVerify = await axios.post(
            backendUrl + "/api/user/verifyEmail",
            { email }
          );
          if (emailVerify.data.success) {
            setTimeout(() => {
              navigate("/verifyOtp/email", { state: { email } });
            }, 2000);
          } else toast.error(emailVerify.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    try {
      if (password.length < 8) {
        toast.error("Password must be larger than 8 character");
        return;
      }
      if (password === confirmPassword) {
        const res = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (res.data.success) {
          toast.success("Registered Successfully");
          const emailVerify = await axios.post(
            backendUrl + "/api/user/verifyEmail",
            { email }
          );
          if (emailVerify.data.success) {
            setTimeout(() => {
              navigate("/verifyOtp/email", { state: { email } });
            }, 2000);
          } else toast.error(emailVerify.data.message);
        } else toast.error(res.data.message);
      } else toast.error("Password doesn't match");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      if (page === "cart") {
        navigate("/cart");
      } else {
        navigate("/");
      }
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center">
      <div className=" p-6 w-full max-w-sm">
        {/* Login Form */}
        {isLogin && (
          <form
            onSubmit={handleLoginSubmit}
            className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto  gap-4 text-lg"
          >
            <div className="inline-flex items-center gap-2 mb-2 mt-6">
              <p className="prata-regular text-3xl">Login</p>
              <hr className="border-none w-8 h-[1.5px] bg-gray-800" />
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-2 px-3 border border-gray-800 "
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="w-full p-2 border border-gray-800"
              minLength={8}
            />
            <div className="w-full flex justify-between">
              <Link
                to="/forgotPassword"
                className="text-sm text-gray-600 hover:underline"
              >
                Forgot Password?
              </Link>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-sm text-gray-600 hover:underline"
              >
                Create account
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? <BeatLoader color="#ffffff" size={8} /> : "Login"}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {!isLogin && (
          <form
            onSubmit={handleSignupSubmit}
            className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto  gap-4 text-lg"
          >
            <div className="inline-flex items-center gap-2 mb-2 mt-6">
              <p className="prata-regular text-3xl">Sign Up</p>
              <hr className="border-none w-8 h-[1.5px] bg-gray-800" />
            </div>
            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              className="w-full p-2 border border-gray-800"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="w-full p-2 border border-gray-800"
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="w-full p-2 border border-gray-800"
            />
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              className="w-full p-2 border border-gray-800"
            />
            <div className="w-full flex justify-between">
              <Link
                to="/forgotPassword"
                className="text-sm text-gray-600 hover:underline"
              >
                Forgot Password?
              </Link>
              {/* <span className="text-sm text-gray-600"></span> */}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-sm text-gray-600 hover:underline"
              >
                Login here!
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded"
            >
              {loading ? <BeatLoader color="#ffffff" size={8} /> : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default Login;
