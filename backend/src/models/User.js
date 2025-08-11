// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // NEW: Fields for password reset functionality
  resetPasswordToken: {
    type: String,
    // By setting 'select: false', this field will not be returned
    // in query results by default, improving security.
    select: false,
  },
  resetPasswordExpire: Date,
});

// --- Mongoose Middleware (Pre-save Hook for Password Hashing) ---
// This runs BEFORE a user document is saved to the database.
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  // This is crucial to prevent re-hashing the password during other updates
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt (random string) for hashing
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed to save the user
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

// --- Instance Method for Password Comparison ---
// This method will be available on user documents to compare provided password with the hashed one
UserSchema.methods.matchPassword = async function(enteredPassword) {
  // Compare the entered password with the hashed password stored in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
