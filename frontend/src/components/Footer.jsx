/* eslint-disable no-unused-vars */
import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-4 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-8">
          <div className="sm:col-span-3 space-y-4">
            <h3 className="text-xl font-bold">Company Name</h3>
            <p className="text-sm">
              Creating amazing experiences and building the future of web
              development.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="hover:text-gray-700 transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-gray-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-gray-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-gray-700 transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="">
              <li>
                <Link
                  to="/about"
                  className="hover:text-gray-700 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-700 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-700 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-gray-700 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-1">
            <h3 className="text-lg font-semibold mb-2">Get in touch</h3>
            <ul className="">
              <li>
                <Link to="#" className="hover:text-gray-700 transition-colors">
                  01700000000
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-700 transition-colors">
                  contact@mail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
