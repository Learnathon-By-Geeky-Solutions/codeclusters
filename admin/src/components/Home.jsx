import React from "react";
import logo from "../assets/logo.png";
const Home = () => {
  return (
    <div className="flex justify-center flex-col items-center w-full">
      <h1>Welcome Admin!</h1>
      <img className="h-64 w-64" src={logo} alt="Admin dashboard logo" />
    </div>
  );
};

export default Home;
