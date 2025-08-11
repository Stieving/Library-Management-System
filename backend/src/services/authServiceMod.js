// // src/services/authService.js
// import User from '../models/User.js'; // Import the User model (default export)
// import pkg from 'jsonwebtoken'; // Corrected: Import as default, then destructure
// const { sign, verify } = pkg;  // For creating and verifying JWTs
// import bcrypt from 'bcryptjs'; // For comparing passwords during login
// import { logger } from '../utils/logger.js'; // Import your logger for consistency
// import { AppError } from '../utils/appError.js'; // Import AppError for consistent error handling

// // Function to generate a JWT token
// const generateToken = (id) => {
//   logger.debug(`Generating token for user ID: ${id}`);
//   return sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '1h', // Token expires in 1 hour
//   });
// };

// // Handles user registration
// export async function registerUser(userData) {
//   const { username, email, password } = userData;
//   logger.info(`Attempting to register user: ${username} (${email})`);

//   try {
//     // Check if user already exists by email or username
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       const field = existingUser.email === email ? 'Email' : 'Username';
//       logger.warn(`${field} already registered: ${existingUser[field]}`);
//       throw new AppError(409, `${field} already registered.`); // Conflict
//     }

//     // Create a new user instance (password hashing happens via pre-save hook in User model)
//     const user = new User({ username, email, password });
//     await user.save();

//     // Generate a token for the newly registered user
//     const token = generateToken(user._id);
//     logger.info(`User registered successfully: ${username}`);

//     // Return user details and the token
//     return {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token,
//     };
//   } catch (error) {
//     if (error instanceof AppError) throw error; // Re-throw if it's already an ApiError
//     logger.error(`Error during user registration: ${error.message}`, error);
//     throw new AppError(500, 'Registration failed due to server error.');
//   }
// }

// // Handles user login
// export async function loginUser(credentials) {
//   const { email, password } = credentials;
//   logger.info(`Attempting to log in user with email: ${email}`);

//   try {
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       logger.warn(`Login failed: User not found for email: ${email}`);
//       throw new AppError(401, 'Invalid credentials'); // Unauthorized
//     }

//     // Compare provided password with the hashed password in the database
//     const isMatch = await user.matchPassword(password); // Using the instance method from User model
//     if (!isMatch) {
//       logger.warn(`Login failed: Incorrect password for email: ${email}`);
//       throw new AppError(401, 'Invalid credentials'); // Unauthorized
//     }

//     // Generate a token for the logged-in user
//     const token = generateToken(user._id);
//     logger.info(`User logged in successfully: ${user.username}`);

//     // Return user details and the token
//     return {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token,
//     };
//   } catch (error) {
//     if (error instanceof AppError) throw error; // Re-throw if it's already an ApiError
//     logger.error(`Error during user login: ${error.message}`, error);
//     throw new AppError(500, 'Login failed due to server error.');
//   }
// }

// // Handles logout (JWTs are stateless, so logout is conceptual invalidation)
// export function logoutUser(token) {
//   // For stateless JWTs, "logout" typically means discarding the token on the client-side.
//   // On the server, you can optionally maintain a blacklist of invalidated tokens
//   // for a short period (e.g., until their natural expiration) to prevent immediate reuse.
//   logger.info(`Logout requested. Client should discard token: ${token ? 'present' : 'absent'}`);
//   return { message: 'Logged out successfully.' };
// }

// // Verifies a JWT token
// export function verifyToken(token) {
//   if (!token) {
//     logger.warn('Token verification failed: No token provided.');
//     throw new AppError(401, 'No token provided'); // Unauthorized
//   }

//   try {
//     // Verify the token using the secret key
//     const decoded = verify(token, process.env.JWT_SECRET);
//     logger.debug(`Token verified for user ID: ${decoded.id}`);
//     // Return the decoded payload (e.g., user ID)
//     return decoded;
//   } catch (error) {
//     // Handle different JWT verification errors
//     if (error.name === 'TokenExpiredError') {
//       logger.warn('Token verification failed: Token expired.');
//       throw new AppError(401, 'Token expired'); // Unauthorized
//     }
//     logger.error(`Token verification failed: ${error.message}`, error);
//     throw new AppError(401, 'Invalid token'); // Unauthorized
//   }
// }

// // Function to find a user by ID
// export async function findUserById(id) {
//   try {
//     // Exclude the password field from the returned user object for security
//     const user = await User.findById(id).select('-password');
//     if (!user) {
//       logger.warn(`User not found for ID: ${id}`);
//       throw new AppError(404, 'User not found.');
//     }
//     logger.debug(`User found by ID: ${id}`);
//     return user;
//   } catch (error) {
//     if (error instanceof AppError) throw error; // Re-throw if it's already an ApiError
//     logger.error(`Error finding user by ID ${id}: ${error.message}`, error);
//     throw new AppError(500, 'Failed to retrieve user data.');
//   }
// }
