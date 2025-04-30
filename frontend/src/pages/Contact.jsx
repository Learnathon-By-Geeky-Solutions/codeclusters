import React from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center px-5 py-36 max-w-screen-lg mx-auto">
      <div className="flex items-stretch justify-center max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden mx-auto p-0">
        
        <div className="flex-1 flex items-center justify-center">
          <img
            src={assets.contact_img}
            alt="Workspace"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Contact Information Section */}
        <div className="flex-1 p-5 flex flex-col justify-center bg-gradient-to-r from-white to-gray-100 border-l-4 border-black shadow-inner">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Contact <span className="text-black">Us</span>
          </h2>

          {/* Store Details */}
          <div className="mt-3">
            <h3 className="text-sm font-bold text-gray-700">Head Office</h3>
            <p className="text-xs text-gray-600 leading-relaxed">Motihar</p>
            <p className="text-xs text-gray-600 leading-relaxed">Rajshahi, Bangladesh</p>
            <p className="text-xs text-gray-600 leading-relaxed">Tel: 01700000000</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Email:{" "}
              <a href="mailto:contact@mail.com" className="text-blue-600">
                contact@mail.com
              </a>
            </p>

            {/* Our Stores Button */}
            <button
              onClick={() => navigate("/storeShop")}
              className="inline-block px-4 py-2 bg-gradient-to-r from-black to-gray-600 text-white font-bold rounded-lg mt-3 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 transform hover:translate-y-1 transition-all ease-in-out"
            >
              Our Stores
            </button>
          </div>

          {/* Careers Section */}
          <div className="mt-4">
            <h3 className="text-sm font-bold text-gray-700">CAREERS </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Learn more about our teams and job openings.
            </p>
            <button
              onClick={() => navigate("/exploreJobs")}
              className="inline-block px-4 py-2 bg-gradient-to-r from-black to-gray-600 text-white font-bold rounded-lg mt-2 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 transform hover:translate-y-1 transition-all ease-in-out"
            >
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
