import React from 'react';

function Loading({ loading }) {
  if (!loading) return null;
  return (
    <div className="text-center text-indigo-500 font-semibold mb-6">Loading...</div>
  );
}

export default Loading;
