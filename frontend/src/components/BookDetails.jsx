import React from 'react';

function BookDetails({ book }) {
  if (!book) return null;
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">Selected Book Details</h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>ISBN:</strong> {book.isbn}</p>
        <p><strong>Title:</strong> {book.title}</p>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Publisher:</strong> {book.publisher || 'N/A'}</p>
        <p><strong>Publication Year:</strong> {book.publicationYear || 'N/A'}</p>
        <p><strong>Status:</strong> {book.isBorrowed ? 'Borrowed' : 'Available'}</p>
        <p><strong>Borrowed At:</strong> {book.borrowedAt ? new Date(book.borrowedAt).toLocaleString() : 'N/A'}</p>
        <p><strong>Returned At:</strong> {book.returnedAt ? new Date(book.returnedAt).toLocaleString() : 'N/A'}</p>
      </div>
    </div>
  );
}

export default BookDetails;
