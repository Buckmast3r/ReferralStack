import React from 'react';

export default function AnalyticsCard({ title, value }) {
  return (
    <div className="border rounded-lg p-6 bg-white text-center shadow">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}