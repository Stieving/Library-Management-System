import React from 'react';

function ActionButtons({
  loading,
  isbnInput,
  setIsbnInput,
  onGetAllBooks,
  onGetBookByIsbn,
  onGetBookStats,
  onBorrowBook,
  onReturnBook,
  onDeleteBook
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={onGetAllBooks}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50"
          disabled={loading}
        >
          Get All Books
        </button>
        
        <button
          onClick={onGetBookStats}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50"
          disabled={loading}
        >
          Get Statistics
        </button>
        
        <div className="md:col-span-1"></div>
      </div>
      
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Book Operations (Enter ISBN)</h3>
        
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter ISBN"
            value={isbnInput}
            onChange={(e) => setIsbnInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={onGetBookByIsbn}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
            disabled={loading || !isbnInput}
          >
            Find Book
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onBorrowBook}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
            disabled={loading || !isbnInput}
          >
            Borrow
          </button>
          <button
            onClick={onReturnBook}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
            disabled={loading || !isbnInput}
          >
            Return
          </button>
          <button
            onClick={onDeleteBook}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
            disabled={loading || !isbnInput}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionButtons;