// import React from 'react';

// function Message({ message, type }) {
//   if (!message) return null;

//   let colorClasses = 'bg-indigo-100 text-indigo-800'; // Default
//   if (type === 'success') {
//     colorClasses = 'bg-green-100 text-green-800'; // Green for success
//   } else if (type === 'error') {
//     colorClasses = 'bg-red-100 text-red-800'; // Red for error
//   }

//   return (
//     <div className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${colorClasses} ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//       {message}
//     </div>
    
//   );
// }

// export default Message;


import React from 'react';

function Message({ message }) {
  if (!message) return null;

  // Normalize message into an object { type, text }
  const msgObj =
    typeof message === 'string'
      ? { type: message.toLowerCase().includes('success') ? 'success' : 'error', text: message }
      : message;

  const { type, text } = msgObj;
  const isSuccess = type === 'success';

  return (
    <div
      className={`p-3 rounded-lg mb-6 text-center text-sm font-medium ${
        isSuccess ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
      }`}
    >
      {text}
    </div>
  );
}

export default Message;
