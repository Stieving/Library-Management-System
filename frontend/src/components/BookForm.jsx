// frontend/src/components/BookForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from "react-toastify"; // ✅ add toast

function BookForm({ bookData, setBookData, loading, onAdd, onUpdate }) {
  const { isLoggedIn } = useAuth();
  const [errors, setErrors] = useState({ isbn: '', title: '', author: '' });

  const isValidIsbn = (isbn) => {
    const cleaned = isbn.replace(/-/g, "");
    return /^[0-9]{10}$/.test(cleaned) || /^[0-9]{13}$/.test(cleaned);
  };

  const validateFields = () => {
    const newErrors = { isbn: '', title: '', author: '' };

    if (!isValidIsbn(bookData.isbn)) {
      newErrors.isbn = "Incorrect ISBN format (must be 10 or 13 digits)";
    }
    if (!bookData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    if (!bookData.author?.trim()) {
      newErrors.author = "Author is required";
    }

    setErrors(newErrors);
    return !newErrors.isbn && !newErrors.title && !newErrors.author;
  };

  const handleAdd = async () => {
    if (!validateFields()) return;

    try {
      await onAdd();
      toast.success("Book added successfully!");
    } catch (err) {
      toast.error("Failed to add book");
    }
  };

  const handleUpdate = async () => {
    if (!isValidIsbn(bookData.isbn)) {
      setErrors({ ...errors, isbn: "Incorrect ISBN, cannot update book" });
      return;
    }

    setErrors({ isbn: '', title: '', author: '' });
    try {
      await onUpdate();
      toast.success("Book updated successfully!");
    } catch (err) {
      toast.error("Failed to update book");
    }
  };

  const isAddButtonDisabled = loading || !isLoggedIn;
  const isUpdateButtonDisabled = loading || !isLoggedIn;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Add / Update Book</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ISBN Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter ISBN"
              value={bookData.isbn}
              onChange={(e) => setBookData({ ...bookData, isbn: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                ${errors.isbn ? "border-red-500" : "border-gray-300"}`}
              disabled={loading}
            />
            {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter title"
              value={bookData.title}
              onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                ${errors.title ? "border-red-500" : "border-gray-300"}`}
              disabled={loading}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Author Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter author"
              value={bookData.author}
              onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                ${errors.author ? "border-red-500" : "border-gray-300"}`}
              disabled={loading}
            />
            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
          </div>

          {/* Publisher Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publisher
            </label>
            <input
              type="text"
              placeholder="Enter publisher (optional)"
              value={bookData.publisher}
              onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Publication Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication Year
            </label>
            <input
              type="number"
              placeholder="Enter year (optional)"
              value={bookData.publicationYear}
              onChange={(e) => setBookData({ ...bookData, publicationYear: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div></div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleAdd}
            className="flex-1 max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
            disabled={isAddButtonDisabled}
          >
            Add Book
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 max-w-xs bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
            disabled={isUpdateButtonDisabled}
          >
            Update Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookForm;
