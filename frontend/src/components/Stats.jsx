import React from 'react';

function Stats({ stats }) {
  if (!stats) return null;
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Library Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Total Unique Books:</strong> {stats.total}</p>
        <p><strong>Total Borrowed Books:</strong> {stats.borrowed}</p>
        <p><strong>Total Available Books:</strong> {stats.available}</p>
      </div>
    </div>
  );
}

export default Stats;
