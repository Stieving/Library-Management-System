import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
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
      const data = await getAllBooks();
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
      const data = await getBookByIsbn(isbnInput);
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
      const data = await addBook(payload);
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
      const data = await updateBook(bookData.isbn, updatePayload);
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
      const data = await deleteBook(isbnInput);
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
      const data = await borrowBook(isbnInput);
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
      const data = await returnBook(isbnInput);
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
      const data = await getBookStats();
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-700">
              Library Management System
            </h1>
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
    </BrowserRouter>
  );
}

export default App;
