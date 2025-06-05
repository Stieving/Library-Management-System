import bookService from '../services/bookService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateBook, validateBookUpdate } from '../utils/validation.js';

export const getAllBooks = asyncHandler(async (req, res) => {
  const { author, title, status } = req.query;
  const filters = { author, title, status };
  
  const books = await bookService.getAllBooks(filters);
  
  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  });
});

export const getBookByIsbn = asyncHandler(async (req, res) => {
  const { isbn } = req.params;
  const book = await bookService.getBookByIsbn(isbn);
  
  res.status(200).json({
    success: true,
    data: book
  });
});

export const addBook = asyncHandler(async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  const book = await bookService.addBook(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Book added successfully',
    data: book
  });
});

export const borrowBook = asyncHandler(async (req, res) => {
  const { isbn } = req.params;
  const book = await bookService.borrowBook(isbn);
  
  res.status(200).json({
    success: true,
    message: `Book "${book.title}" borrowed successfully`,
    data: book
  });
});

export const returnBook = asyncHandler(async (req, res) => {
  const { isbn } = req.params;
  const book = await bookService.returnBook(isbn);
  
  res.status(200).json({
    success: true,
    message: `Book "${book.title}" returned successfully`,
    data: book
  });
});

export const updateBook = asyncHandler(async (req, res) => {
  const { isbn } = req.params;
  const { error } = validateBookUpdate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  const book = await bookService.updateBook(isbn, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Book updated successfully',
    data: book
  });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const { isbn } = req.params;
  const result = await bookService.deleteBook(isbn);
  
  res.status(200).json({
    success: true,
    message: result.message
  });
});

export const getBookStats = asyncHandler(async (req, res) => {
  const stats = await bookService.getBookStats();
  
  res.status(200).json({
    success: true,
    data: stats
  });
});