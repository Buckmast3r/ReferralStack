import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AuthenticatedLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow p-6">{children}</main>
      <Footer />
    </div>
  );
}