/* eslint-disable no-unused-vars */

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import VerifyPayment from "./pages/VerifyPayment";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import ExploreJobs from "./pages/ExploreJobs";
import StoresShop from "./pages/StoresShop.jsx";
const App = () => {
  return (
    <div className="px-3 sm:px-[2vw] md:px-[4vw] lg:px-[7vw]">
      <ToastContainer position="top-center" newestOnTop />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />

        <Route path="/placeOrder" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verifyPayment" element={<VerifyPayment />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/verifyOtp/:otpFor" element={<VerifyOTP />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/exploreJobs" element={<ExploreJobs />} />
        <Route path="/storeShop" element={<StoresShop/>} /> 
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
