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
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET routes
router.get('/', getAllBooks);
router.get('/stats', getBookStats);
router.get('/:isbn', getBookByIsbn);

// POST routes
router.post('/', authenticate, addBook);
router.post('/:isbn/borrow', authenticate, borrowBook);
router.post('/:isbn/return', authenticate, returnBook);

// PUT routes
router.put('/:isbn', authenticate, updateBook);

// DELETE routes
router.delete('/:isbn', authenticate, deleteBook);

export default router;