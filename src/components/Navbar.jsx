import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center p-6 max-w-6xl mx-auto">
      <div className="text-xl font-bold">ReferralStack</div>
      <nav className="flex space-x-6 items-center">
        <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
        <Link to="/pricing" className="text-gray-700 hover:text-black">Pricing</Link>
        <Link to="/login" className="text-gray-700 hover:text-black">Login</Link>
        <Link to="/register">
          <Button className="!px-4 !py-2 !text-base !rounded-md">Register</Button>
        </Link>
      </nav>
    </header>
  );
}
