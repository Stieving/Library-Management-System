// frontend/src/pages/LibraryDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { Link } from 'react-router-dom'; // Import Link for navigation

// Import your existing API service functions.
// IMPORTANT: These functions in '../services/api.js' MUST be modified
// to accept a 'token' argument and include it in the Authorization header.
import {
  getAllBooks,
  getBookByIsbn,
  addBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getBookStats
} from '../services/api'; // Assuming your API service is here

// Import your existing components
import BookList from '../components/BookList';
import BookDetails from '../components/BookDetails';
import Stats from '../components/Stats';
import BookForm from '../components/BookForm';
import Message from '../components/Message';
import Loading from '../components/Loading';
import ActionButtons from '../components/ActionButtons';


function LibraryDashboard() {
  // Get user, token, and logout function from AuthContext
  const { user, logout, token } = useContext(AuthContext);

  // All your existing states from the old App.jsx
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Set to false initially, true when fetching
  const [isbnInput, setIsbnInput] = useState('');
  const [bookData, setBookData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '', // Ensure these match your backend model if used
    publicationYear: '' // Ensure these match your backend model if used
  });
  const [stats, setStats] = useState(null);

  // Refs for scrolling (from your old AppRoutes.jsx)
  const resultsRef = React.useRef(null);
  const statsRef = React.useRef(null);
  const bookDetailsRef = React.useRef(null);
  const messageRef = React.useRef(null);

  // Helper function to show messages (from your old App.jsx)
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };

  // Effect for scrolling (from your old AppRoutes.jsx)
  React.useEffect(() => {
    if (loading) return; // Don't scroll if still loading

    const timer = setTimeout(() => {
      // Prioritize message, then books, then stats, then selected book
      if (message && messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (books.length > 0 && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (stats && statsRef.current) {
        statsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (selectedBook && bookDetailsRef.current) {
        bookDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Small delay to allow DOM to update

    return () => clearTimeout(timer);
  }, [books, stats, selectedBook, message, loading]);


  // Handler for all books (modified to use token)
  const handleGetAllBooks = async () => {
    setLoading(true);
    setMessage('');
    setBooks([]); // Clear previous books
    setSelectedBook(null); // Clear selected book
    setStats(null); // Clear stats
    try {
      // Pass the token to your API service function
      const data = await getAllBooks(token);
      if (data.success) {
        setBooks(data.data); // Assuming backend returns { success: true, data: [...] }
        showMessage('All books retrieved successfully!');
      } else {
        showMessage(`Failed to retrieve books: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error fetching all books:', err);
      showMessage('Network error: Could not connect to backend or authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for get book by ISBN (modified to use token)
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
      // Pass the token to your API service function
      const data = await getBookByIsbn(isbnInput, token);
      if (data.success) {
        setSelectedBook(data.data);
        showMessage(`Book with ISBN ${isbnInput} found successfully!`);
      } else {
        showMessage(`Book with ISBN ${isbnInput} not found: ${data.message || 'Unknown error'}`);
        setSelectedBook(null);
      }
    } catch (err) {
      console.error('Error fetching book by ISBN:', err);
      showMessage('Network error: Could not connect to backend or authentication failed.');
    } finally {
      setLoading(false);
      setIsbnInput(''); // Clear input
    }
  };

  // Handler for add book (modified to use token)
  const handleAddBook = async (e) => {
    e.preventDefault(); // Prevent default form submission
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
        // Include publisher, publicationYear if your backend model expects them
        // publisher: bookData.publisher,
        // publicationYear: bookData.publicationYear
      };
      // Pass the token to your API service function
      const data = await addBook(payload, token);
      if (data.success) {
        showMessage('Book added successfully!');
        setBookData({ isbn: '', title: '', author: '', publisher: '', publicationYear: '' }); // Clear form
        handleGetAllBooks(); // Refresh book list
      } else {
        showMessage(`Failed to add book: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error adding book:', err);
      showMessage('Network error: Could not connect to backend or authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for update book (modified to use token)
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
    // Include publisher, publicationYear if your backend model supports them
    // if (bookData.publisher) updatePayload.publisher = bookData.publisher;
    // if (bookData.publicationYear) updatePayload.publicationYear = bookData.publicationYear;

    try {
      // Pass the token to your API service function
      const data = await updateBook(bookData.isbn, updatePayload, token);
      if (data.success) {
        showMessage('Book updated successfully!');
        setBookData({ isbn: '', title: '', author: '', publisher: '', publicationYear: '' }); // Clear form
        handleGetAllBooks(); // Refresh book list
      } else {
        showMessage(`Failed to update book: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error updating book:', err);
      showMessage('Network error: Could not connect to backend or authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for delete book (modified to use token)
  const handleDeleteBook = async () => {
    setLoading(true);
    setMessage('');
    if (!isbnInput) {
      showMessage('Please enter an ISBN to delete.');
      setLoading(false);
      return;
    }
    try {
      // Pass the token to your API service function
      const data = await deleteBook(isbnInput, token);
      if (data.success) {
        showMessage('Book deleted successfully!');
        handleGetAllBooks(); // Refresh book list
      } else {
        showMessage(`Failed to delete book: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting book:', err);
      showMessage('Network error: Could not connect to backend or authentication failed.');
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };

  // Handler for borrow book (modified to use token)
  const handleBorrowBook = async () => {
    setLoading(true);
    setMessage('');
    if (!isbnInput) {
      showMessage('Please enter an ISBN to borrow.');
      setLoading(false);
      return;
    }
    try {
      // Pass the token to your API service function
      const data = await borrowBook(isbnInput, token);
      if (data.success) {
        showMessage('Book borrowed successfully!');
        handleGetAllBooks(); // Refresh book list
      } else {
        showMessage(`Failed to borrow book: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error borrowing book:', err);
      showMessage('Network error: Could not connect to backend or authentication failed.');
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };

  // Handler for return book (modified to use token)
  const handleReturnBook = async () => {
    setLoading(true);
    setMessage('');
    if (!isbnInput) {
      showMessage('Please enter an ISBN to return.');
      setLoading(false);
      return;
    }
    try {
      // Pass the token to your API service function
      const data = await returnBook(isbnInput, token);
      if (data.success) {
        showMessage('Book returned successfully!');
        handleGetAllBooks(); // Refresh book list
      } else {
        showMessage(`Failed to return book: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error returning book:', err);
      showMessage('Network error: Could not connect to backend or authentication failed.');
    } finally {
      setLoading(false);
      setIsbnInput('');
    }
  };

  // Handler for get book stats (modified to use token)
  const handleGetBookStats = async () => {
    setLoading(true);
    setMessage('');
    setBooks([]);
    setSelectedBook(null);
    try {
      // Pass the token to your API service function
      const data = await getBookStats(token);
      if (data.success) {
        setStats(data.data);
        showMessage('Book statistics retrieved successfully!');
      } else {
        showMessage(`Failed to retrieve book statistics: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error fetching book stats:', err);
      showMessage('Network error: Could not connect to backend or authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Group all handlers for easier passing if needed (though direct use is fine here)
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

  // Initial fetch of books when the component mounts and token is available
  useEffect(() => {
    if (token) { // Only fetch books if a token exists (user is logged in)
      handleGetAllBooks();
    }
  }, [token]); // Dependency array: re-run when token changes (e.g., after login)


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700">
            Library Dashboard
          </h1>
          {/* Conditional rendering for logged in or logged out state */}
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-lg">Welcome, {user.username}!</span>
              <button
                onClick={logout} // Call logout from AuthContext
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
        <div ref={messageRef}>
          <Message message={message} />
        </div>
        <Loading loading={loading} />
        <ActionButtons
          loading={loading}
          isbnInput={isbnInput}
          setIsbnInput={setIsbnInput}
          onGetAllBooks={handlers.handleGetAllBooks}
          onGetBookByIsbn={handlers.handleGetBookByIsbn}
          onGetBookStats={handlers.handleGetBookStats}
          onBorrowBook={handlers.handleBorrowBook}
          onReturnBook={handlers.handleReturnBook}
          onDeleteBook={handlers.handleDeleteBook}
        />
        <BookForm
          bookData={bookData}
          setBookData={setBookData}
          loading={loading}
          onAdd={handlers.handleAddBook}
          onUpdate={handlers.handleUpdateBook}
        />
        <div ref={resultsRef}>
          <BookList books={books} />
        </div>
        <div ref={bookDetailsRef}>
          <BookDetails book={selectedBook} />
        </div>
        <div ref={statsRef}>
          <Stats stats={stats} />
        </div>
      </div>
    </div>
  );
}

export default LibraryDashboard;
