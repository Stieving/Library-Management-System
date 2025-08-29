import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';
import bookRoutes from './src/routes/bookRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { logger } from './src/utils/logger.js';
import authRoutes from './src/routes/authRoutes.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

// NEW IMPORTS: Add these to support password reset
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js'; // Make sure this path is correct

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
// Mount your existing book routes
app.use('/api/books', bookRoutes);
// NEW: Mount authentication routes
app.use('/api/auth', authRoutes); // This mounts the authentication endpoints

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// NEW: Add a simple test user to the database if one doesn't exist.
// This is for demonstration purposes to make it easier to test the password reset flow.
// async function createTestUser() {
//     // Only run this if the database connection is ready
//     if (mongoose.connection.readyState !== 1) {
//         logger.error('Database not connected. Cannot create test user.');
//         return;
//     }
//     const existingUser = await User.findOne({ email: 'testuser@example.com' });
//     if (!existingUser) {
//         const passwordHash = await bcrypt.hash('password123', 10);
//         const testUser = new User({
//             email: 'testuser@example.com',
//             passwordHash: passwordHash
//         });
//         await testUser.save();
//         logger.info('Test user created: testuser@example.com / password123');
//     }
// }
// createTestUser();

// Error handling middleware (should be last)
app.use(errorHandler);

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(port, () => {
 logger.info(`LMS API listening at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
 logger.info('SIGTERM received, shutting down gracefully');
 process.exit(0);
});

process.on('SIGINT', () => {
 logger.info('SIGINT received, shutting down gracefully');
 process.exit(0);
});
