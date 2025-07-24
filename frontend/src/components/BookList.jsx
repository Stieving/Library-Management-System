import React from 'react';

function BookList({ books }) {
  if (!books || books.length === 0) return null;
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-4">All Books</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ISBN</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Author</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Borrowed At</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Returned At</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.isbn} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                <td className="py-3 px-4 text-sm text-gray-800">{book.isbn}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{book.title}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{book.author}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{book.isBorrowed ? 'Borrowed' : 'Available'}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{book.borrowedAt ? new Date(book.borrowedAt).toLocaleDateString() : 'N/A'}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{book.returnedAt ? new Date(book.returnedAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookList;
