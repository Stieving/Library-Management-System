import Book from '../models/Book.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

class BookService {
  async getAllBooks(filters = {}) {
    try {
      const query = {};
      
      // Apply filters
      if (filters.author) {
        query.author = { $regex: filters.author, $options: 'i' };
      }
      if (filters.title) {
        query.title = { $regex: filters.title, $options: 'i' };
      }
      if (filters.status) {
        query.isBorrowed = filters.status === 'borrowed';
      }

      const books = await Book.find(query).sort({ createdAt: -1 });
      return books;
    } catch (error) {
      logger.error('Error getting all books:', error);
      throw new AppError('Failed to retrieve books', 500);
    }
  }

  async getBookByIsbn(isbn) {
    try {
      const book = await Book.findByIsbn(isbn);
      if (!book) {
        throw new AppError(`Book with ISBN ${isbn} not found`, 404);
      }
      return book;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error getting book by ISBN:', error);
      throw new AppError('Failed to retrieve book', 500);
    }
  }

  async addBook(bookData) {
    try {
      // Check if book with ISBN already exists
      const existingBook = await Book.findByIsbn(bookData.isbn);
      if (existingBook) {
        throw new AppError(`Book with ISBN ${bookData.isbn} already exists`, 409);
      }

      const book = new Book(bookData);
      await book.save();
      
      logger.info(`Book added: ${book.title} (ISBN: ${book.isbn})`);
      return book;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error.code === 11000) {
        throw new AppError('Book with this ISBN already exists', 409);
      }
      logger.error('Error adding book:', error);
      throw new AppError('Failed to add book', 500);
    }
  }

  async borrowBook(isbn) {
    try {
      const book = await Book.findByIsbn(isbn);
      if (!book) {
        throw new AppError(`Book with ISBN ${isbn} not found`, 404);
      }

      if (book.isBorrowed) {
        throw new AppError(`Book "${book.title}" is already borrowed`, 409);
      }

      book.borrow();
      await book.save();
      
      logger.info(`Book borrowed: ${book.title} (ISBN: ${book.isbn})`);
      return book;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error borrowing book:', error);
      throw new AppError('Failed to borrow book', 500);
    }
  }

  async returnBook(isbn) {
    try {
      const book = await Book.findByIsbn(isbn);
      if (!book) {
        throw new AppError(`Book with ISBN ${isbn} not found`, 404);
      }

      if (!book.isBorrowed) {
        throw new AppError(`Book "${book.title}" was not borrowed`, 409);
      }

      book.returnBook();
      await book.save();
      
      logger.info(`Book returned: ${book.title} (ISBN: ${book.isbn})`);
      return book;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error returning book:', error);
      throw new AppError('Failed to return book', 500);
    }
  }

  async updateBook(isbn, updateData) {
    try {
      const book = await Book.findByIsbn(isbn);
      if (!book) {
        throw new AppError(`Book with ISBN ${isbn} not found`, 404);
      }

      // Don't allow updating ISBN or borrowing status through this method
      delete updateData.isbn;
      delete updateData.isBorrowed;
      delete updateData.borrowedAt;
      delete updateData.returnedAt;

      Object.assign(book, updateData);
      await book.save();
      
      logger.info(`Book updated: ${book.title} (ISBN: ${book.isbn})`);
      return book;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating book:', error);
      throw new AppError('Failed to update book', 500);
    }
  }

  async deleteBook(isbn) {
    try {
      const book = await Book.findByIsbn(isbn);
      if (!book) {
        throw new AppError(`Book with ISBN ${isbn} not found`, 404);
      }

      if (book.isBorrowed) {
        throw new AppError('Cannot delete a borrowed book', 409);
      }

      await Book.findByIdAndDelete(book._id);
      
      logger.info(`Book deleted: ${book.title} (ISBN: ${book.isbn})`);
      return { message: 'Book deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting book:', error);
      throw new AppError('Failed to delete book', 500);
    }
  }

  async getBookStats() {
    try {
      const totalBooks = await Book.countDocuments();
      const borrowedBooks = await Book.countDocuments({ isBorrowed: true });
      const availableBooks = totalBooks - borrowedBooks;

      return {
        total: totalBooks,
        borrowed: borrowedBooks,
        available: availableBooks
      };
    } catch (error) {
      logger.error('Error getting book stats:', error);
      throw new AppError('Failed to get book statistics', 500);
    }
  }
}

export default new BookService();