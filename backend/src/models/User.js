// models/User.js
import mongoose from 'mongoose'; // Changed from require to import
import bcrypt from 'bcryptjs'; // Changed from require to import

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'], // Username is required
    unique: true, // Username must be unique
    trim: true, // Remove whitespace from both ends of a string
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'], // Email is required
    unique: true, // Email must be unique
    trim: true,
    lowercase: true, // Store emails in lowercase
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email format validation
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'], // Password is required
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation timestamp
  },
});

// --- Mongoose Middleware (Pre-save Hook for Password Hashing) ---
// This runs BEFORE a user document is saved to the database.
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt (random string) for hashing
    const salt = await bcrypt.genSalt(10); // 10 rounds is a good balance for security and performance
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

const User = mongoose.model('User', UserSchema); // Define the User model

export default User; // Changed from module.exports to export default
