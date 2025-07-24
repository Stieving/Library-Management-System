import React, { useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetails from './components/BookDetails';
import Stats from './components/Stats';
import BookForm from './components/BookForm';
import Message from './components/Message';
import Loading from './components/Loading';
import ActionButtons from './components/ActionButtons';

function AppRoutes({
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
  const resultsRef = useRef(null);
  const statsRef = useRef(null);
  const bookDetailsRef = useRef(null);
  const messageRef = useRef(null);
  
  useEffect(() => {
    if (loading) return;
    
    const timer = setTimeout(() => {
      if (message && messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (books.length > 0 && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (stats && statsRef.current) {
        statsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (selectedBook && bookDetailsRef.current) {
        bookDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [books, stats, selectedBook, message, loading]);

  return (
    <Routes>
      <Route path="/" element={
        <>
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
        </>
      } />
    </Routes>
  );
}

export default AppRoutes;