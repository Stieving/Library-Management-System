import React from 'react';

function Message({ message }) {
  if (!message) return null;
  return (
    <div className={`p-3 rounded-lg mb-6 text-center text-sm font-medium ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {message}
    </div>
  );
}

export default Message;
