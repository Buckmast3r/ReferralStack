import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
              RefStack.me
            </Link>
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors" aria-label="Privacy Policy">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-300 hover:text-white transition-colors" aria-label="Terms of Service">
              Terms
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors" aria-label="Contact Us">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;