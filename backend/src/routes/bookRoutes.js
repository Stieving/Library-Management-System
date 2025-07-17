import express from 'express';
import {
  getAllBooks,
  getBookByIsbn,
  addBook,
  borrowBook,
  returnBook,
  updateBook,
  deleteBook,
  getBookStats
} from '../controllers/bookController.js';

const router = express.Router();

// GET routes
router.get('/', getAllBooks);
router.get('/stats', getBookStats);
router.get('/:isbn', getBookByIsbn);

// POST routes
router.post('/', addBook);
router.post('/:isbn/borrow', borrowBook);
router.post('/:isbn/return', returnBook);

// PUT routes
router.put('/:isbn', updateBook);

// DELETE routes
router.delete('/:isbn', deleteBook);

export default router;