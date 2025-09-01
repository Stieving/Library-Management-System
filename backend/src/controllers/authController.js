// src/controllers/authController.js

import {
  registerUser,
  loginUser,
  logoutUser,
  findUserById,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
} from "../services/authService.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export async function register(req, res) {
  try {
    // Call the registerUser service method with request body data
    const user = await registerUser(req.body);
    // Send a success response with user data and token
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    // Handle errors (e.g., duplicate email/username, validation errors)
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export async function login(req, res) {
  try {
    // Call the loginUser service method with request body credentials
    const user = await loginUser(req.body);
    // Send a success response with user data and token
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: user,
    });
  } catch (error) {
    // Handle errors (e.g., invalid credentials)
    res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
}

// @desc    Log out user (invalidate token conceptually)
// @route   POST /api/auth/logout
// @access  Private (client-side action, but endpoint can be protected)
export function logout(req, res) {
  // Extract token from headers (if present)
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  // Call the logoutUser service method
  const result = logoutUser(token);
  // Send a success response
  res.status(200).json({
    success: true,
    message: result.message,
  });
}

// @desc    Get current authenticated user's profile
// @route   GET /api/auth/me
// @access  Private (requires authentication)
export async function getMe(req, res) {
  try {
    // The 'authenticate' middleware attaches the user object to req.user
    // We only send back public user information, not the hashed password
    const user = await findUserById(req.user.id); // Assuming authService has a findUserById
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User data retrieved",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve user data",
    });
  }
}

// @desc    Request a password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    res.status(200).json({
      success: true,
      message:
        "If a user with this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to initiate password reset.",
    });
  }
}

// @desc    Reset password with a valid token
// @route   POST /api/auth/reset-password
// @access  Public
export async function resetPassword(req, res) {
  try {
    const { newPassword } = req.body;
    const { token } = req.params; // now from URL params
    await resetPasswordService(token, newPassword);
    res
      .status(200)
      .json({ success: true, message: "Password reset successful." });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: error.message || "Failed to reset password.",
      });
  }
}
