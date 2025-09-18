// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  getAllBooks,
  getBookByIsbn,
  addBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getBookStats
} from './services/api';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}

// Main content component that uses the auth context
function AppContent() {
  const { user, token, isLoggedIn, logout } = useAuth();
  
  // Book management state
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isbnInput, setIsbnInput] = useState('');
  const [bookData, setBookData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publicationYear: ''
  });
  const [stats, setStats] = useState(null);

  const handleGetAllBooks = async () => {
    setLoading(true);
    setBooks([]);
    setSelectedBook(null);
    setStats(null);
    
    try {
      const data = await getAllBooks(token);
      if (data.success) {
        setBooks(data.data);
        toast.success("All books retrieved successfully!");
      } else {
        toast.error(`Failed to retrieve books: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error("Network error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };
      
  const handleGetBookByIsbn = async () => {
    setLoading(true);
    setSelectedBook(null);
    setBooks([]);
    setStats(null);
    
    if (!isbnInput) {
      toast.error('Please enter an ISBN.');
      setLoading(false);
      return;
    }
    
    try {
      const data = await getBookByIsbn(isbnInput, token);
      if (data.success) {
        setSelectedBook(data.data);
        toast.success(`Book with ISBN ${isbnInput} found successfully!`);
      } else {
        toast.error(`Book with ISBN ${isbnInput} not found: ${data.message || 'Unknown error'}`);
        setSelectedBook(null);
      }
    } catch (error) {
      toast.error('Network error: Could not connect to backend.');
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };

  const handleAddBook = async () => { 
    setLoading(true);

    if (!bookData.isbn || !bookData.title || !bookData.author) {
      toast.error("Please fill in ISBN, Title, and Author.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        isbn: bookData.isbn,
        title: bookData.title,
        author: bookData.author
      };

      const data = await addBook(payload, token);

      if (data.success) {
        toast.success("Book added successfully!");
        setBookData({ isbn: '', title: '', author: '', publisher: '', publicationYear: '' });
      } else {
        if (data.message && data.message.toLowerCase().includes("isbn already exists")) {
          toast.error("Cannot add book: ISBN already exists");
        } else {
          toast.error(`Failed to add book: ${data.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      toast.error("Network error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBook = async () => {
    setLoading(true);
    
    if (!bookData.isbn || (!bookData.title && !bookData.author && !bookData.publisher && !bookData.publicationYear)) {
      toast.error('Please enter ISBN and at least one field (Title, Author, Publisher, Publication Year) to update.');
      setLoading(false);
      return;
    }
    
    const updatePayload = {};
    if (bookData.title) updatePayload.title = bookData.title;
    if (bookData.author) updatePayload.author = bookData.author;
    if (bookData.publisher) updatePayload.publisher = bookData.publisher;
    if (bookData.publicationYear) updatePayload.publicationYear = bookData.publicationYear;
    
    try {
      const data = await updateBook(bookData.isbn, updatePayload, token);
      if (data.success) {
        toast.success('Book updated successfully!');
        setBookData({ isbn: '', title: '', author: '', publisher: '', publicationYear: '' });
      } else {
        toast.error(`Failed to update book: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Network error: Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async () => {
    setLoading(true);
    
    if (!isbnInput) {
      toast.error('Please enter an ISBN to delete.');
      setLoading(false);
      return;
    }
    
    try {
      const data = await deleteBook(isbnInput, token);
      if (data.success) {
        toast.success('Book deleted successfully!');
      } else {
        toast.error(`Failed to delete book: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Network error: Could not connect to backend.');
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };

  const handleBorrowBook = async () => {
    setLoading(true);
    
    if (!isbnInput) {
      toast.error('Please enter an ISBN to borrow.');
      setLoading(false);
      return;
    }
    
    try {
      const data = await borrowBook(isbnInput, token);
      if (data.success) {
        toast.success("Book borrowed successfully!");
      } else {
        toast.error(`Failed to borrow book: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error("Network error: Could not connect to backend.");
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };

  const handleReturnBook = async () => {
    setLoading(true);
    
    if (!isbnInput) {
      toast.error("Please enter an ISBN to return.");
      setLoading(false);
      return;
    }

    try {
      const data = await returnBook(isbnInput, token);
      if (data.success) {
        toast.success("Book returned successfully!");
      } else {
        toast.error(`Failed to return book: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error("Network error: Could not connect to backend.");
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };

  const handleGetBookStats = async () => {
    setLoading(true);
    setBooks([]);
    setSelectedBook(null);
    
    try {
      const data = await getBookStats(token);
      if (data.success) {
        setStats(data.data);
        toast.success("Book statistics retrieved successfully!");
      } else {
        toast.error(`Failed to retrieve book statistics: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error("Network error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handlers = {
    handleGetAllBooks,
    handleGetBookByIsbn,
    handleAddBook,
    handleUpdateBook,
    handleDeleteBook,
    handleBorrowBook,
    handleReturnBook,
    handleGetBookStats
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with conditional links */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700">
            Library Management System
          </h1>
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-lg">Welcome, {user?.username || 'User'}!</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AppRoutes
          books={books}
          selectedBook={selectedBook}
          stats={stats}
          bookData={bookData}
          setBookData={setBookData}
          loading={loading}
          isbnInput={isbnInput}
          setIsbnInput={setIsbnInput}
          handlers={handlers}
        />
      </div>
    </div>
  );
}

export default App;