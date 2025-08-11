// // routes/authRoutes.js
// import express from 'express';
// import { register, login, logout, getMe } from '../controllers/authController.js';
// import { authenticate } from '../middleware/authMiddleware.js'; 

// const router = express.Router();

// // Public routes
// router.post('/register', register); // Route for user registration
// router.post('/login', login);     // Route for user login

// // Protected routes (require authentication middleware)
// router.post('/logout', authenticate, logout); // Logout (requires token to be sent, though stateless)
// router.get('/me', authenticate, getMe);      // Get current user's profile (requires valid token)

// export default router;
