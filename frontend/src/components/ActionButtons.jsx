// frontend/src/components/ActionButtons.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from "react-toastify"; 

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
  const { isLoggedIn } = useAuth(); 
  const [isbnError, setIsbnError] = useState(""); 

  const isPublicButtonDisabled = loading;
  const isActionButtonDisabled = loading || (!isLoggedIn && !isbnInput);

  const isValidIsbn = (isbn) => {
    const cleaned = isbn.replace(/-/g, ""); 
    return /^[0-9]{10}$/.test(cleaned) || /^[0-9]{13}$/.test(cleaned);
  };

  const validateIsbn = () => {
    if (!isbnInput) {
      setIsbnError("ISBN is required");
      return false;
    }
    if (!isValidIsbn(isbnInput)) {
      setIsbnError("Invalid ISBN format (must be 10 or 13 digits)");
      return false;
    }
    setIsbnError("");
    return true;
  };

  // ✅ Wrappers that validate ISBN before running handlers
  const handleFindBook = async () => {
  if (!isValidIsbn(isbnInput)) {
    setIsbnError("Incorrect ISBN, Cannot Find Book");
    return;
  }
  setIsbnError(""); 

  try {
    const result = await onGetBookByIsbn();
    if (result) {
      toast.success("Book found successfully!");
    }
    } catch (error) {
      toast.error("Could not find book. Please try again.");
    }
  };


  const handleBorrowBook = () => {
    if (!validateIsbn()) return;
    onBorrowBook();
    toast.success("Book borrowed successfully!");
  };

  const handleReturnBook = () => {
    if (!validateIsbn()) return;
    onReturnBook();
    toast.success("Book returned successfully!");
  };

  const handleDeleteBook = () => {
    if (!validateIsbn()) return;
    onDeleteBook();
    toast.success("Book deleted successfully!");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
      
      {/* Public Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={onGetAllBooks}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50"
          disabled={isPublicButtonDisabled}
        >
          Get All Books
        </button>
        
        <button
          onClick={onGetBookStats}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50"
          disabled={isPublicButtonDisabled}
        >
          Get Statistics
        </button>
        
        <div className="md:col-span-1"></div>
      </div>
      
      {/* ISBN Input + Find Book */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Book Operations (Enter ISBN)</h3>
        
        <div className="flex gap-3 mb-2">
          <input
            type="text"
            placeholder="Enter ISBN"
            value={isbnInput}
            onChange={(e) => {
              setIsbnInput(e.target.value);
              if (isbnError) setIsbnError("");
            }}
            className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              isbnError 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
            }`}
            disabled={isPublicButtonDisabled}
          />
          <button
            onClick={handleFindBook}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
            disabled={isPublicButtonDisabled}
          >
            Find Book
          </button>
        </div>
        {isbnError && <p className="text-red-500 text-sm mb-3">{isbnError}</p>}
        
        {/* Borrow / Return / Delete */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleBorrowBook}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
            disabled={isActionButtonDisabled}
          >
            Borrow
          </button>
          <button
            onClick={handleReturnBook}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
            disabled={isActionButtonDisabled}
          >
            Return
          </button>
          <button
            onClick={handleDeleteBook}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
            disabled={isActionButtonDisabled}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-1 p-3 bg-gray-50 rounded text-sm text-gray-600">
        <strong>Note:</strong> To Borrow, Return or Delete a book, kindly Login or Signup.
      </div>
    </div>
  );
}

export default ActionButtons;
