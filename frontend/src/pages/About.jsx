// eslint-disable-next-line no-unused-vars
import React from "react";
import {assets} from "../assets/assets.js";

const About = () => {
  return (
    
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui aperiam architecto vero. Asperiores nostrum facilis sapiente suscipit modi voluptatem expedita porro adipisci veritatis neque fuga cumque, nisi quasi, sunt ullam.
            </p>
            <p className="mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit officiis est voluptatem! Hic necessitatibus vitae dolore minima ex perferendis veniam quibusdam ab voluptas repellat dicta ut doloremque architecto laudantium eum tempora, dolorem minus distinctio accusantium dignissimos a molestiae? Ea nesciunt debitis eaque. Debitis maiores ullam temporibus reiciendis accusamus doloremque, qui impedit cupiditate tempora quae natus corrupti enim aut a laborum necessitatibus officiis quis corporis est nobis quas assumenda molestias suscipit iusto! Quas quis in sunt voluptate, accusamus aliquid magnam voluptatum?
            </p>
            <h3 className="text-lg font-semibold mt-5">Our Mission</h3>
            <p className="mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum eum tempore voluptas, quisquam officiis necessitatibus tenetur sed atque, expedita voluptatem, a excepturi nihil. Animi, aperiam, eius magnam ipsa sapiente, iure est harum ipsum voluptate esse libero sunt nesciunt doloremque rem.
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

  );
};

export default About;
