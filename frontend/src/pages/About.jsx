// eslint-disable-next-line no-unused-vars
import React from "react";
import {assets} from "../assets/assets.js";

const About = () => {
  return (
    <>
        <div className="px-5 py-20 max-w-screen-xl mx-auto font-sans text-gray-800">
      {/* ABOUT US SECTION */}
      <section className="mb-20">
        <h2 className="text-center text-2xl font-semibold mb-10">
          ABOUT <span className="font-bold">US</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <img
            src = {assets.about_img}
            alt="About Us"
            className="w-full max-w-md rounded-xl shadow-md mx-auto"
          />
          <div className="text-justify flex-1 md:pl-10">
            <p className="mb-4">
              Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online.
              Our journey began with a simple idea: to provide a platform where customers can easily discover, explore,
              and purchase a wide range of products from the comfort of their homes.
            </p>
            <p className="mb-4">
              Since our inception, we’ve worked tirelessly to curate a diverse selection of high-quality products that
              cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an
              extensive collection sourced from trusted brands and suppliers.
            </p>
            <h3 className="text-lg font-semibold mt-5">Our Mission</h3>
            <p className="mt-2">
              Our mission at Forever is to empower customers with choice, convenience, and confidence. We’re dedicated
              to providing a seamless shopping experience that exceeds expectations — from browsing and ordering to
              delivery and beyond.
            </p>
          </div>
        </div>
      </section>

      
      <section>
        <h2 className="text-center text-2xl font-semibold mb-10">
          WHY <span className="font-bold">CHOOSE US</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="border border-gray-300 p-6 rounded-lg flex-1">
            <h4 className="font-bold mb-2">QUALITY ASSURANCE:</h4>
            <p>
              We meticulously select and vet each product to ensure it meets our stringent quality standards.
            </p>
          </div>
          <div className="border border-gray-300 p-6 rounded-lg flex-1">
            <h4 className="font-bold mb-2">CONVENIENCE:</h4>
            <p>
              With our user-friendly interface and hassle-free ordering process, shopping has never been easier.
            </p>
          </div>
          <div className="border border-gray-300 p-6 rounded-lg flex-1">
            <h4 className="font-bold mb-2">EXCEPTIONAL CUSTOMER SERVICE:</h4>
            <p>
              Our team of dedicated professionals is here to assist you every step of the way.
            </p>
          </div>
        </div>
      </section>
    </div>
</>
  );
};

export default About;
