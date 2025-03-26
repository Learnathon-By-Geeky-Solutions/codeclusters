// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState(location.state?.email || "");
  console.log(email);
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // email = e.target.email.value;
    const password = e.target.password.value;
    // console.log("Login:", { email, password });
    try {
      const res = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });
      console.log(res);
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
        console.log(res);
        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
        } else toast.error(res.data.message);
        // console.log("Signup:", { name, email, password, confirmPassword });
      } else toast.error("Password doesn't match");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
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
            >
              Login
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
              <a href="#" className="text-sm text-gray-600 hover:underline">
                Forgot Password?
              </a>
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
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default Login;
