// src/services/authService.js

import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import User from "../models/User.js"; // Import the User model (default export)
import pkg from "jsonwebtoken"; // Corrected: Import as default, then destructure
const { sign, verify } = pkg; // For creating and verifying JWTs
import bcrypt from "bcryptjs"; // For comparing passwords during login
import { logger } from "../utils/logger.js"; // Import your logger for consistency
import { AppError } from "../utils/appError.js"; // Import AppError for consistent error handling

// --- Helper Functions ---

// Function to generate a JWT token
const generateToken = (id) => {
  logger.debug(`Generating token for user ID: ${id}`);
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// --- Main Service Functions ---

// Handles user registration
export async function registerUser(userData) {
  const { username, email, password } = userData;
  logger.info(`Attempting to register user: ${username} (${email})`);

  try {
    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      logger.warn(`${field} already registered: ${existingUser[field]}`);
      throw new AppError(409, `${field} already registered.`); // Conflict
    }

    // Create a new user instance (password hashing happens via pre-save hook in User model)
    const user = new User({ username, email, password });
    await user.save();

    // Generate a token for the newly registered user
    const token = generateToken(user._id);
    logger.info(`User registered successfully: ${username}`);

    // Return user details and the token
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    };
  } catch (error) {
    if (error instanceof AppError) throw error; // Re-throw if it's already an ApiError
    logger.error(`Error during user registration: ${error.message}`, error);
    throw new AppError(500, "Registration failed due to server error.");
  }
}

// Handles user login
export async function loginUser(credentials) {
  const { email, password } = credentials;
  logger.info(`Attempting to log in user with email: ${email}`);

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: User not found for email: ${email}`);
      throw new AppError(401, "Invalid credentials"); // Unauthorized
    }

    // Compare provided password with the hashed password in the database
    const isMatch = await user.matchPassword(password); // Using the instance method from User model
    if (!isMatch) {
      logger.warn(`Login failed: Incorrect password for email: ${email}`);
      throw new AppError(401, "Invalid credentials"); // Unauthorized
    }

    // Generate a token for the logged-in user
    const token = generateToken(user._id);
    logger.info(`User logged in successfully: ${user.username}`);

    // Return user details and the token
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    };
  } catch (error) {
    if (error instanceof AppError) throw error; // Re-throw if it's already an ApiError
    logger.error(`Error during user login: ${error.message}`, error);
    throw new AppError(500, "Login failed due to server error.");
  }
}

// Handles logout (JWTs are stateless, so logout is conceptual invalidation)
export function logoutUser(token) {
  // For stateless JWTs, "logout" typically means discarding the token on the client-side.
  // On the server, you can optionally maintain a blacklist of invalidated tokens
  // for a short period (e.g., until their natural expiration) to prevent immediate reuse.
  logger.info(
    `Logout requested. Client should discard token: ${
      token ? "present" : "absent"
    }`
  );
  return { message: "Logged out successfully." };
}

// Verifies a JWT token
export function verifyToken(token) {
  if (!token) {
    logger.warn("Token verification failed: No token provided.");
    throw new AppError(401, "No token provided"); // Unauthorized
  }

  try {
    // Verify the token using the secret key
    const decoded = verify(token, process.env.JWT_SECRET);
    logger.debug(`Token verified for user ID: ${decoded.id}`);
    // Return the decoded payload (e.g., user ID)
    return decoded;
  } catch (error) {
    // Handle different JWT verification errors
    if (error.name === "TokenExpiredError") {
      logger.warn("Token verification failed: Token expired.");
      throw new AppError(401, "Token expired"); // Unauthorized
    }
    logger.error(`Token verification failed: ${error.message}`, error);
    throw new AppError(401, "Invalid token"); // Unauthorized
  }
}

// Function to find a user by ID
export async function findUserById(id) {
  try {
    // Exclude the password field from the returned user object for security
    const user = await User.findById(id).select("-password");
    if (!user) {
      logger.warn(`User not found for ID: ${id}`);
      throw new AppError(404, "User not found.");
    }
    logger.debug(`User found by ID: ${id}`);
    return user;
  } catch (error) {
    if (error instanceof AppError) throw error; // Re-throw if it's already an ApiError
    logger.error(`Error finding user by ID ${id}: ${error.message}`, error);
    throw new AppError(500, "Failed to retrieve user data.");
  }
}

/**
 * @desc Handles the logic for a user requesting a password reset.
 * @param {string} email - The email of the user to send the reset link to.
 */
export async function forgotPassword(email) {
  logger.info(`Forgot password request for email: ${email}`);
  const user = await User.findOne({ email });

  // Important: We always return a success message, even if the user isn't found,
  // to prevent an attacker from knowing which emails are registered.
  if (!user) {
    return {
      message: "If a user with that email exists, a reset email will be sent.",
    };
  }

  // Generate a unique, secure token for the password reset
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the token and expiration date on the user document
  // The expiration is set to 1 hour from now
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // Create the reset URL that will be sent to the user
  // TODO: You'll need to define this on your frontend. The port is included
  // for local development, but should be removed in production.
  const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

  // Create the email message
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password.
    Please go to this URL to reset your password: ${resetURL}
    If you did not request this, please ignore this email and your password will remain unchanged.`;

  try {
    // Use the newly imported sendEmail utility
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });
    logger.info(`Password reset email sent to: ${user.email}`);
    return { message: "Email sent" };
  } catch (err) {
    // If email sending fails, clear the token from the user document to
    // prevent a security issue.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    logger.error(
      `Failed to send password reset email to ${user.email}: ${err.message}`,
      err
    );
    throw new AppError(
      500,
      "There was an error sending the email. Please try again later."
    );
  }
}

/**
 * @desc Handles the logic for a user resetting their password.
 * @param {string} token - The reset token from the URL.
 * @param {string} newPassword - The user's new password.
 */
export async function resetPassword(token, newPassword) {
  logger.info("Attempting to reset password with token.");

  // Hash the incoming token to find a match in the database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find the user with the matching token and a non-expired date
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    logger.warn("Password reset failed: Invalid or expired token.");
    throw new AppError(400, "Invalid or expired password reset token.");
  }

  // Set the new password, then clear the token fields
  // The pre-save hook in the User model will handle hashing the new password.
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  logger.info(`Password successfully reset for user: ${user.email}`);

  return { message: "Password reset successful." };
}
