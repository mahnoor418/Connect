import React from 'react';
import { FaInstagram, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 mt-16">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">

        {/* Left Section */}
        <div className="text-center md:text-left space-y-6 md:space-y-4">
          <h3 className="text-3xl font-extrabold text-white mb-2">Connect</h3>
          <p className="text-lg mb-6 md:mb-4">Connecting people, creating moments. Join the conversation and share your world.</p>

          <div className="flex space-x-6 justify-center md:justify-start mb-6">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-300 transition duration-300"
              title="Instagram"
            >
              <FaInstagram size={30} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition duration-300"
              title="GitHub"
            >
              <FaGithub size={30} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-300 transition duration-300"
              title="LinkedIn"
            >
              <FaLinkedin size={30} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition duration-300"
              title="Twitter"
            >
              <FaTwitter size={30} />
            </a>
          </div>
        </div>

        {/* Middle Section (Additional Links) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <h4 className="text-xl font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-3 text-lg">
            <li><a href="/about" className="hover:text-blue-300 transition duration-300">About Us</a></li>
            <li><a href="/privacy" className="hover:text-blue-300 transition duration-300">Privacy Policy</a></li>
            <li><a href="/contact" className="hover:text-blue-300 transition duration-300">Contact</a></li>
          </ul>
        </div>

        {/* Right Section (Newsletter or Contact) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <h4 className="text-xl font-semibold mb-2">Stay Connected</h4>
          <p className="text-lg mb-4">Sign up for our newsletter to stay updated on the latest news and features.</p>
          <div className="flex items-center gap-4 md:gap-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 text-black rounded-l-lg w-60 md:w-72"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center pt-8 pb-4 border-t border-white mt-8">
        <p className="text-sm text-white">
          &copy; {new Date().getFullYear()} Connect. All rights reserved. Designed with 💙 by Team Connect.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
