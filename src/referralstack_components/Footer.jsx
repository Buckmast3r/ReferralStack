import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 p-6 text-center text-sm text-gray-500">
      <div className="space-x-4">
        <Link to="/terms" className="hover:underline">Terms</Link>
        <Link to="/privacy" className="hover:underline">Privacy</Link>
      </div>
      <p className="mt-4">&copy; {new Date().getFullYear()} ReferralStack. All rights reserved.</p>
    </footer>
  );
}