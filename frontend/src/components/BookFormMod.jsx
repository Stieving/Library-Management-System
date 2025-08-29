// import React from 'react';
// import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

// function BookForm({ bookData, setBookData, loading, onAdd, onUpdate }) {
//   // Use the hook to get the login status and loading state from the auth context
//   const { isLoggedIn } = useAuth(); 

//   // Add a helper function to check if the required fields are filled for adding a book
//   const isAddButtonDisabled = () => {
//     // Check if loading or not logged in, or if any required field is empty
//     return loading || !isLoggedIn || !bookData.isbn || !bookData.title || !bookData.author;
//   };

//   // Add a helper function to check if the required fields are filled for updating a book
//   const isUpdateButtonDisabled = () => {
//     // Update requires a user to be logged in and an ISBN to be present
//     return loading || !isLoggedIn || !bookData.isbn;
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
//       <h2 className="text-lg font-semibold text-gray-800 mb-6">Add / Update Book</h2>
      
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               ISBN <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter ISBN"
//               value={bookData.isbn}
//               onChange={(e) => setBookData({ ...bookData, isbn: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               disabled={loading || !isLoggedIn}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Title <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter title"
//               value={bookData.title}
//               onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               disabled={loading || !isLoggedIn}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Author <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter author"
//               value={bookData.author}
//               onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               disabled={loading || !isLoggedIn}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Publisher
//             </label>
//             <input
//               type="text"
//               placeholder="Enter publisher (optional)"
//               value={bookData.publisher}
//               onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               disabled={loading || !isLoggedIn}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Publication Year
//             </label>
//             <input
//               type="number"
//               placeholder="Enter year (optional)"
//               value={bookData.publicationYear}
//               onChange={(e) => setBookData({ ...bookData, publicationYear: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               disabled={loading || !isLoggedIn}
//             />
//           </div>
//           <div></div>
//         </div>

//         <div className="flex gap-4 pt-4">
//           <button
//             onClick={onAdd}
//             className="flex-1 max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
//             disabled={isAddButtonDisabled()} // Updated to check if all required fields are present
//           >
//             Add Book
//           </button>
//           <button
//             onClick={onUpdate}
//             className="flex-1 max-w-xs bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
//             disabled={isUpdateButtonDisabled()} // Updated to check if an ISBN is present
//           >
//             Update Book
//           </button>
//         </div>
//       </div>
      
//       <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
//         <strong>Note:</strong> Fields marked with <span className="text-red-500">*</span> are required for adding books. 
//         For updates, enter the ISBN and modify any field you want to change.
//       </div>

//       <div className="mt-1 p-3 bg-gray-50 rounded text-sm text-gray-600">
//         <strong>Note:</strong> To Add or Update a book. Kindly Login or Signup
//       </div>
//     </div>
//   );
// }

// export default BookForm;
