// src/controllers/authController.js

import {
  registerUser,
  loginUser,
  logoutUser,
  findUserById,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  verifyEmailService,
  resendVerificationEmailService
} from "../services/authService.js";
import { AppError } from "../utils/appError.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export async function register(req, res) {
  try {
    // Register user, generate verification token & send verification email
    await registerUser(req.body);

    res.status(201).json({
      success: true,
      message:
        "Registration successful. A verification link has been sent to your email.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed.",
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
    const user = await findUserById(req.user.id);
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
    const { token } = req.params;
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

// @desc    Verify user's email with a valid token
// @route   GET /api/auth/verify-email
// @access  Public
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    await verifyEmailService(token);

    // ✅ Redirect directly to login with success
    return res.redirect(
      "http://localhost:5173/login?verified=true"
    );
  } catch (error) {
    return res.redirect(
      "http://localhost:5173/login?verified=false&message=" +
        encodeURIComponent(error.message || "Verification failed.")
    );
  }
}

export const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const result = await resendVerificationEmailService(email);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error("Resend verification error:", err);
    next(new AppError(500, "Failed to resend verification email."));
  }
};
