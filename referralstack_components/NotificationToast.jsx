import React from 'react';

export default function NotificationToast({ message, type }) {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded text-white shadow ${bgColor}`}>
      {message}
    </div>
  );
}