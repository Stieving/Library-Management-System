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
import { loginService, registerService, logoutService, getMeService } from './services/authService';

function App() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');
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

  // --- Authentication State and Handlers ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchUser = async (userToken) => {
    try {
      setAuthLoading(true);
      const response = await getMeService(userToken);
      if (response.success) {
        setUser(response.data);
        setIsLoggedIn(true);
        setAuthError(null);
      } else {
        throw new Error(response.message || "Failed to fetch user data.");
      }
    } catch (err) {
      console.error('Auth fetchUser error:', err);
      logout();
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await loginService(email, password);
      if (response.success) {
        const newToken = response.data.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        await fetchUser(newToken);
        showMessage('Logged in successfully!');
      } else {
        setAuthError(response.message || 'Login failed.');
        showMessage(response.message || 'Login failed.');
      }
    } catch (err) {
      setAuthError('Network error or login failed.');
      showMessage('Network error or login failed.');
      setAuthLoading(false);
    }
  };

  const handleSignup = async (username, email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await registerService(username, email, password);
      if (response.success) {
        const newToken = response.data.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        await fetchUser(newToken);
        showMessage('Signed up and logged in successfully!');
      } else {
        setAuthError(response.message || 'Sign up failed.');
        showMessage(response.message || 'Sign up failed.');
      }
    } catch (err) {
      setAuthError('Network error or sign up failed.');
      showMessage('Network error or sign up failed.');
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logoutService(token); 
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setAuthError(null);
    showMessage('Logged out successfully!');
  };

  // Bundle authentication state and handlers for the AuthProvider
  const authContextValue = {
    user,
    token,
    isLoggedIn,
    loading: authLoading, // Renamed to 'loading' for consistency with your AuthContext
    error: authError,
    login: handleLogin,
    register: handleSignup,
    logout: handleLogout,
  };
// --- Existing Library Handlers from your original code ---
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };
  const handleGetAllBooks = async () => {
    setLoading(true);
    setMessage('');
    setBooks([]);
    setSelectedBook(null);
    setStats(null);
    try {
      // Pass the token to the API call
      const data = await getAllBooks(token);
      if (data.success) {
        setBooks(data.data);
        showMessage('All books retrieved successfully!');
      } else {
        showMessage(`Failed to retrieve books: ${data.message || 'Unknown error'}`);
      }
    } catch {
      showMessage('Network error: Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };
  const handleGetBookByIsbn = async () => {
    setLoading(true);
    setMessage('');
    setSelectedBook(null);
    setBooks([]);
    setStats(null);
    if (!isbnInput) {
      showMessage('Please enter an ISBN.');
      setLoading(false);
      return;
    }
    try {
      // Pass the token to the API call
      const data = await getBookByIsbn(isbnInput, token);
      if (data.success) {
        setSelectedBook(data.data);
        showMessage(`Book with ISBN ${isbnInput} found successfully!`);
      } else {
        showMessage(`Book with ISBN ${isbnInput} not found: ${data.message || 'Unknown error'}`);
        setSelectedBook(null);
      }
    } catch {
      showMessage('Network error: Could not connect to backend.');
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };
  const handleAddBook = async () => {
    setLoading(true);
    setMessage('');
    if (!bookData.isbn || !bookData.title || !bookData.author) {
      showMessage('Please fill in ISBN, Title, and Author.');
      setLoading(false);
      return;
    }
    try {
      const payload = {
        isbn: bookData.isbn,
        title: bookData.title,
        author: bookData.author
      };
      // Pass the token to the API call
      const data = await addBook(payload, token);
      if (data.success) {
        showMessage('Book added successfully!');
        setBookData({ isbn: '', title: '', author: '', publisher: '', publicationYear: '' });
      } else {
        showMessage(`Failed to add book: ${data.message || 'Unknown error'}`);
      }
    } catch {
      showMessage('Network error: Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateBook = async () => {
    setLoading(true);
    setMessage('');
    if (!bookData.isbn || (!bookData.title && !bookData.author && !bookData.publisher && !bookData.publicationYear)) {
      showMessage('Please enter ISBN and at least one field (Title, Author, Publisher, Publication Year) to update.');
      setLoading(false);
      return;
    }
    const updatePayload = {};
    if (bookData.title) updatePayload.title = bookData.title;
    if (bookData.author) updatePayload.author = bookData.author;
    try {
      // Pass the token to the API call
      const data = await updateBook(bookData.isbn, updatePayload, token);
      if (data.success) {
        showMessage('Book updated successfully!');
        setBookData({ isbn: '', title: '', author: '', publisher: '', publicationYear: '' });
      } else {
        showMessage(`Failed to update book: ${data.message || 'Unknown error'}`);
      }
    } catch {
      showMessage('Network error: Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteBook = async () => {
    setLoading(true);
    setMessage('');
    if (!isbnInput) {
      showMessage('Please enter an ISBN to delete.');
      setLoading(false);
      return;
    }
    try {
      // Pass the token to the API call
      const data = await deleteBook(isbnInput, token);
      if (data.success) {
        showMessage('Book deleted successfully!');
      } else {
        showMessage(`Failed to delete book: ${data.message || 'Unknown error'}`);
      }
    } catch {
      showMessage('Network error: Could not connect to backend.');
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };
  const handleBorrowBook = async () => {
    setLoading(true);
    setMessage('');
    if (!isbnInput) {
      showMessage('Please enter an ISBN to borrow.');
      setLoading(false);
      return;
    }
    try {
      // Pass the token to the API call
      const data = await borrowBook(isbnInput, token);
      if (data.success) {
        showMessage('Book borrowed successfully!');
      } else {
        showMessage(`Failed to borrow book: ${data.message || 'Unknown error'}`);
      }
    } catch {
      showMessage('Network error: Could not connect to backend.');
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };
  const handleReturnBook = async () => {
    setLoading(true);
    setMessage('');
    if (!isbnInput) {
      showMessage('Please enter an ISBN to return.');
      setLoading(false);
      return;
    }
    try {
      // Pass the token to the API call
      const data = await returnBook(isbnInput, token);
      if (data.success) {
        showMessage('Book returned successfully!');
      } else {
        showMessage(`Failed to return book: ${data.message || 'Unknown error'}`);
      }
    } catch {
      showMessage('Network error: Could not connect to backend.');
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };
  const handleGetBookStats = async () => {
    setLoading(true);
    setMessage('');
    setBooks([]);
    setSelectedBook(null);
    try {
      // Pass the token to the API call
      const data = await getBookStats(token);
      if (data.success) {
        setStats(data.data);
        showMessage('Book statistics retrieved successfully!');
      } else {
        showMessage(`Failed to retrieve book statistics: ${data.message || 'Unknown error'}`);
      }
    } catch {
      showMessage('Network error: Could not connect to backend.');
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
    <BrowserRouter>
      {/* The AuthProvider now wraps the entire application */}
      <AuthProvider value={authContextValue}>
        <AppContent
          books={books}
          selectedBook={selectedBook}
          stats={stats}
          bookData={bookData}
          setBookData={setBookData}
          loading={loading}
          message={message}
          isbnInput={isbnInput}
          setIsbnInput={setIsbnInput}
          handlers={handlers}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

// A new component to render the main content, which can now use useAuth()
function AppContent({
  books,
  selectedBook,
  stats,
  bookData,
  setBookData,
  loading,
  message,
  isbnInput,
  setIsbnInput,
  handlers
}) {
  const { user, isLoggedIn, logout } = useAuth();
  
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
          message={message}
          isbnInput={isbnInput}
          setIsbnInput={setIsbnInput}
          handlers={handlers}
        />
      </div>
    </div>
  );
}


export default App;