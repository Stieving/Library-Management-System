// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import dotenv from 'dotenv';
// import { connectDB } from './src/config/database.js';
// import bookRoutes from './src/routes/bookRoutes.js';
// import { errorHandler } from './src/middleware/errorHandler.js';
// import { logger } from './src/utils/logger.js';
// import authRoutes from './src/routes/authRoutes.js'; // NEW: Import authentication routes

// // Load environment variables
// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Connect to MongoDB
// connectDB();

// // Security middleware
// app.use(helmet());
// app.use(cors());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // --- Routes ---
// // Mount your existing book routes
// app.use('/api/books', bookRoutes);
// // NEW: Mount authentication routes
// app.use('/api/auth', authRoutes); // This mounts the authentication endpoints

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

// // Error handling middleware (should be last)
// app.use(errorHandler);

// // Handle 404
// app.use('*', (req, res) => {
//   res.status(404).json({
//     message: 'Route not found',
//     path: req.originalUrl
//   });
// });

// // Start server
// app.listen(port, () => {
//   logger.info(`LMS API listening at http://localhost:${port}`);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   logger.info('SIGTERM received, shutting down gracefully');
//   process.exit(0);
// });

// process.on('SIGINT', () => {
//   logger.info('SIGINT received, shutting down gracefully');
//   process.exit(0);
// });
