import React from "react";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-white text-lg shadow-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 