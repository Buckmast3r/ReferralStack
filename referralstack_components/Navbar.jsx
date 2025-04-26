import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">ReferralStack</Link>
      <div className="flex gap-4">
        <Link to="/pricing" className="text-gray-700 hover:text-indigo-600">Pricing</Link>
        <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
        <Link to="/register" className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md">Sign Up</Link>
      </div>
    </nav>
  );
}