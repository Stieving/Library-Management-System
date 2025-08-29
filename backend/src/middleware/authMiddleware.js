// middleware/authMiddleware.js
import jwt from 'jsonwebtoken'; 
import { verifyToken } from '../services/authService.js';



// Middleware to authenticate requests
export async function authenticate(req, res, next) {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer TOKEN_STRING")
      token = req.headers.authorization.split(' ')[1];

      // Verify token using the authService
      const decoded = verifyToken(token);

      // Attach the user ID from the token payload to the request object
      // This makes the user ID available in subsequent route handlers
      req.user = { id: decoded.id };

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      // Handle various token errors (invalid, expired, etc.)
      res.status(401).json({
        success: false,
        message: error.message || 'Not authorized, token failed',
      });
    }
  } else { 
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
}
