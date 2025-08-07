// import React, { useState, useEffect } from 'react';

// // Define your backend API base URL
// const API_BASE_URL = 'http://localhost:3000/api/books';

// // Main App component for the Library Management System UI
// function App() {
//   // State variables for managing UI elements and data
//   const [books, setBooks] = useState([]); // Stores the list of all books from backend
//   const [selectedBook, setSelectedBook] = useState(null); // Stores details of a single selected book
//   const [message, setMessage] = useState(''); // Displays messages to the user (success, error, info)
//   const [loading, setLoading] = useState(false); // Indicates if an operation is in progress
//   const [isbnInput, setIsbnInput] = useState(''); // Input for ISBN for various operations
//   const [bookData, setBookData] = useState({ // Input for Add/Update Book form
//     isbn: '',
//     title: '',
//     author: '',
//     publisher: '',
//     publicationYear: '',
//   });
//   const [stats, setStats] = useState(null); // Stores book statistics from backend

//   // Helper function to display messages
//   const showMessage = (text, type = 'info') => {
//     setMessage(text);
//     // Clears a message after 5 seconds
//     setTimeout(() => setMessage(''), 5000);
//   };

//   // --- API Integration Functions ---

//   // Fetches all books from the backend
//   const handleGetAllBooks = async () => {
//     setLoading(true);
//     setMessage('');
//     setBooks([]); // Clear books before fetching
//     setSelectedBook(null); // Clear selected book
//     setStats(null); // Clear stats

//     try {
//       const response = await fetch(API_BASE_URL);
//       const data = await response.json();

//       if (response.ok) {
//         setBooks(data.data); // Backend returns { success: true, count: ..., data: [...] }
//         showMessage('All books retrieved successfully!', 'success'); // Specific success message
//       } else {
//         // Handle API errors
//         showMessage(`Failed to retrieve books: ${data.message || 'Unknown error'}`, 'error');
//         console.error('Error fetching all books:', data);
//       }
//     } catch (error) {
//       // Handle network errors
//       showMessage('Network error: Could not connect to backend.', 'error');
//       console.error('Network error fetching all books:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetches a single book by ISBN from the backend
//   const handleGetBookByIsbn = async () => {
//     setLoading(true);
//     setMessage('');
//     setSelectedBook(null); // Clear previous selection
//     setBooks([]); // Clear all books list
//     setStats(null); // Clear stats

//     if (!isbnInput) {
//       showMessage('Please enter an ISBN.', 'error');
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await fetch(`${API_BASE_URL}/${isbnInput}`);
//       const data = await response.json();

//       if (response.ok) {
//         setSelectedBook(data.data); // Backend returns { success: true, data: {...} }
//         showMessage(`Book with ISBN ${isbnInput} found successfully!`, 'success'); // Specific success message
//       } else {
//         showMessage(`Book with ISBN ${isbnInput} not found: ${data.message || 'Unknown error'}`, 'error');
//         console.error('Error fetching book by ISBN:', data);
//         setSelectedBook(null); // Clear previous selection on error
//       }
//     } catch (error) {
//       showMessage('Network error: Could not connect to backend.', 'error');
//       console.error('Network error fetching book by ISBN:', error);
//     } finally {
//       setLoading(false);
//       setIsbnInput(''); // Clear ISBN input after attempt
//     }
//   };

//   // Adds a new book to the backend
//   const handleAddBook = async () => {
//     setLoading(true);
//     setMessage('');
//     // Basic frontend validation for required fields matching backend schema
//     if (!bookData.isbn || !bookData.title || !bookData.author) {
//       showMessage('Please fill in ISBN, Title, and Author.', 'error');
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await fetch(API_BASE_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         // Send only fields relevant to the backend Book model (isbn, title, author)
//         body: JSON.stringify({
//           isbn: bookData.isbn,
//           title: bookData.title,
//           author: bookData.author,
//         }),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         showMessage(`Book added successfully!`, 'success'); // Specific success message
//         setBookData({ isbn: '', title: '', author: '', publisher: '', publicationYear: '' }); // Clear form, including re-added fields
//       } else {
//         showMessage(`Failed to add book: ${data.message || 'Unknown error'}`, 'error');
//         console.error('Error adding book:', data);
//       }
//     } catch (error) {
//       showMessage('Network error: Could not connect to backend.', 'error');
//       console.error('Network error adding book:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Borrows a book through the backend
//   const handleBorrowBook = async () => {
//     setLoading(true);
//     setMessage('');
//     if (!isbnInput) {
//       showMessage('Please enter an ISBN to borrow.', 'error');
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await fetch(`${API_BASE_URL}/${isbnInput}/borrow`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({}), // Empty body for POST request
//       });
//       const data = await response.json();

//       if (response.ok) {
//         showMessage(`Book borrowed successfully!`, 'success'); // Specific success message
//       } else {
//         showMessage(`Failed to borrow book: ${data.message || 'Unknown error'}`, 'error');
//         console.error('Error borrowing book:', data);
//       }
//     } catch (error) {
//       showMessage('Network error: Could not connect to backend.', 'error');
//       console.error('Network error borrowing book:', error);
//     } finally {
//       setLoading(false);
//       setIsbnInput('');
//     }
//   };

//   // Returns a book through the backend
//   const handleReturnBook = async () => {
//     setLoading(true);
//     setMessage('');
//     if (!isbnInput) {
//       showMessage('Please enter an ISBN to return.', 'error');
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await fetch(`${API_BASE_URL}/${isbnInput}/return`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({}), // Empty body for POST request
//       });
//       const data = await response.json();

//       if (response.ok) {
//         showMessage(`Book returned successfully!`, 'success'); // Specific success message
//       } else {
//         showMessage(`Failed to return book: ${data.message || 'Unknown error'}`, 'error');
//         console.error('Error returning book:', data);
//       }
//     } catch (error) {
//       showMessage('Network error: Could not connect to backend.', 'error');
//       console.error('Network error returning book:', error);
//     } finally {
//       setLoading(false);
//       setIsbnInput('');
//     }
//   };

//   // Updates a book through the backend
//   const handleUpdateBook = async () => {
//     setLoading(true);
//     setMessage('');
//     // Frontend validation for ISBN and at least one other field for update
//     if (!bookData.isbn || (!bookData.title && !bookData.author && !bookData.publisher && !bookData.publicationYear)) {
//       showMessage('Please enter ISBN and at least one field (Title, Author, Publisher, Publication Year) to update.', 'error');
//       setLoading(false);
//       return;
//     }

//     const updatePayload = {};
//     if (bookData.title) updatePayload.title = bookData.title;
//     if (bookData.author) updatePayload.author = bookData.author;
//     try {
//       const response = await fetch(`${API_BASE_URL}/${bookData.isbn}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatePayload),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         showMessage(`Book updated successfully!`, 'success'); // Specific success message
//         setBookData({ isbn: '', title: '', author: '', publisher: '', publicationYear: '' }); // Clear form
//       } else {
//         showMessage(`Failed to update book: ${data.message || 'Unknown error'}`, 'error');
//         console.error('Error updating book:', data);
//       }
//     } catch (error) {
//       showMessage('Network error: Could not connect to backend.', 'error');
//       console.error('Network error updating book:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Deletes a book through the backend
//   const handleDeleteBook = async () => {
//     setLoading(true);
//     setMessage('');
//     if (!isbnInput) {
//       showMessage('Please enter an ISBN to delete.', 'error');
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await fetch(`${API_BASE_URL}/${isbnInput}`, {
//         method: 'DELETE',
//       });
//       const data = await response.json();

//       if (response.ok) {
//         showMessage(`Book deleted successfully!`, 'success'); // Specific success message
//       } else {
//         showMessage(`Failed to delete book: ${data.message || 'Unknown error'}`, 'error');
//         console.error('Error deleting book:', data);
//       }
//     } catch (error) {
//       showMessage('Network error: Could not connect to backend.', 'error');
//       console.error('Network error deleting book:', error);
//     } finally {
//       setLoading(false);
//       setIsbnInput('');
//     }
//   };

//   // Fetches book statistics from the backend
//   const handleGetBookStats = async () => {
//     setLoading(true);
//     setMessage('');
//     setBooks([]); // Clear all books list
//     setSelectedBook(null); // Clear selected book

//     try {
//       const response = await fetch(`${API_BASE_URL}/stats`);
//       const data = await response.json();

//       if (response.ok) {
//         setStats(data.data); // Backend returns { success: true, data: { total, borrowed, available } }
//         showMessage('Book statistics retrieved successfully!', 'success'); // Specific success message
//       } else {
//         showMessage(`Failed to retrieve book statistics: ${data.message || 'Unknown error'}`, 'error');
//         console.error('Error fetching book stats:', data);
//       }
//     } catch (error) {
//       showMessage('Network error: Could not connect to backend.', 'error');
//       console.error('Network error fetching book stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Render the UI
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
//       <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-4xl">
//         <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-indigo-700 mb-8">
//           Library Management System
//         </h1>

//         {/* Message Display Area */}
//         {message && (
//           <div className={`p-3 rounded-lg mb-6 text-center text-sm font-medium
//             ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
//           >
//             {message}
//           </div>
//         )}

//         {/* Loading Indicator */}
//         {loading && (
//           <div className="text-center text-indigo-500 font-semibold mb-6">
//             Loading...
//           </div>
//         )}

//         {/* Action Buttons Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//           <button
//             onClick={handleGetAllBooks}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md transform hover:scale-105"
//             disabled={loading}
//           >
//             Get All Books
//           </button>

//           {/* Combined ISBN Input and Get Book by ISBN Button */}
//           <div className="relative col-span-1 sm:col-span-2 lg:col-span-1 border border-gray-300 rounded-lg p-2 pb-12 flex flex-col justify-between">
//             <input
//               type="text"
//               placeholder="Enter ISBN"
//               value={isbnInput}
//               onChange={(e) => setIsbnInput(e.target.value)}
//               className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
//               disabled={loading}
//             />
//             <button
//               onClick={handleGetBookByIsbn}
//               className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md transform hover:scale-105"
//               disabled={loading}
//             >
//               Get Book
//             </button>
//           </div>

//           <button
//             onClick={handleGetBookStats}
//             className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md transform hover:scale-105"
//             disabled={loading}
//           >
//             Get Book Stats
//           </button>

//           <button
//             onClick={handleBorrowBook}
//             className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md transform hover:scale-105"
//             disabled={loading}
//           >
//             Borrow Book
//           </button>

//           <button
//             onClick={handleReturnBook}
//             className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md transform hover:scale-105"
//             disabled={loading}
//           >
//             Return Book
//           </button>

//           <button
//             onClick={handleDeleteBook}
//             className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md transform hover:scale-105"
//             disabled={loading}
//           >
//             Delete Book
//           </button>
//         </div>

//         {/* Add/Update Book Form */}
//         <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
//           <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Add / Update Book</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="ISBN (for Add/Update)"
//               value={bookData.isbn}
//               onChange={(e) => setBookData({ ...bookData, isbn: e.target.value })}
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               disabled={loading}
//             />
//             <input
//               type="text"
//               placeholder="Title"
//               value={bookData.title}
//               onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               disabled={loading}
//             />
//             <input
//               type="text"
//               placeholder="Author"
//               value={bookData.author}
//               onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               disabled={loading}
//             />
//             <input
//               type="text"
//               placeholder="Publisher (Optional)"
//               value={bookData.publisher}
//               onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               disabled={loading}
//             />
//             <input
//               type="number"
//               placeholder="Publication Year (Optional)"
//               value={bookData.publicationYear}
//               onChange={(e) => setBookData({ ...bookData, publicationYear: e.target.value })}
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               disabled={loading}
//             />
//           </div>
//           <div className="flex gap-4">
//             <button
//               onClick={handleAddBook}
//               className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md transform hover:scale-105"
//               disabled={loading}
//             >
//               Add Book
//             </button>
//             <button
//               onClick={handleUpdateBook}
//               className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md transform hover:scale-105"
//               disabled={loading}
//             >
//               Update Book
//             </button>
//           </div>
//         </div>

//         {/* Display Areas */}
//         {books.length > 0 && (
//           <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">All Books</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
//                 <thead className="bg-gray-200">
//                   <tr>
//                     <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ISBN</th>
//                     <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Title</th>
//                     <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Author</th>
//                     <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
//                     <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Borrowed At</th>
//                     <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Returned At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {books.map((book, index) => (
//                     <tr key={book.isbn} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
//                       <td className="py-3 px-4 text-sm text-gray-800">{book.isbn}</td>
//                       <td className="py-3 px-4 text-sm text-gray-800">{book.title}</td>
//                       <td className="py-3 px-4 text-sm text-gray-800">{book.author}</td>
//                       <td className="py-3 px-4 text-sm text-gray-800">{book.isBorrowed ? 'Borrowed' : 'Available'}</td>
//                       <td className="py-3 px-4 text-sm text-gray-800">{book.borrowedAt ? new Date(book.borrowedAt).toLocaleDateString() : 'N/A'}</td>
//                       <td className="py-3 px-4 text-sm text-gray-800">{book.returnedAt ? new Date(book.returnedAt).toLocaleDateString() : 'N/A'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {selectedBook && (
//           <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
//             <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Selected Book Details</h2>
//             <div className="space-y-2 text-gray-700">
//               <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
//               <p><strong>Title:</strong> {selectedBook.title}</p>
//               <p><strong>Author:</strong> {selectedBook.author}</p>
//               <p><strong>Publisher:</strong> {selectedBook.publisher || 'N/A'}</p> 
//               <p><strong>Publication Year:</strong> {selectedBook.publicationYear || 'N/A'}</p> 
//               <p><strong>Status:</strong> {selectedBook.isBorrowed ? 'Borrowed' : 'Available'}</p>
//               <p><strong>Borrowed At:</strong> {selectedBook.borrowedAt ? new Date(selectedBook.borrowedAt).toLocaleString() : 'N/A'}</p>
//               <p><strong>Returned At:</strong> {selectedBook.returnedAt ? new Date(selectedBook.returnedAt).toLocaleString() : 'N/A'}</p>
//             </div>
//           </div>
//         )}

//         {stats && (
//           <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
//             <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Library Statistics</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
//               <p><strong>Total Unique Books:</strong> {stats.total}</p>
//               <p><strong>Total Borrowed Books:</strong> {stats.borrowed}</p>
//               <p><strong>Total Available Books:</strong> {stats.available}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
