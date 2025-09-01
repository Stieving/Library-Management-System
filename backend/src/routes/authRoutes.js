import express from 'express';
import { register, login, logout, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Public routes
router.post('/register', register); // Route for user registration
router.post('/login', login); // Route for user login

// Routes for password reset functionality
router.post('/forgot-password', forgotPassword); // Route for forgot password
router.post('/reset-password/:token', resetPassword);

// Protected routes (require authentication middleware)
router.post('/logout', authenticate, logout); // Logout (requires token to be sent, though stateless)
router.get('/me', authenticate, getMe); // Get current user's profile (requires valid token)

export default router;
