import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function(v) {
          // Basic ISBN validation (can be enhanced)
          return /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(v);
        },
        message: 'Invalid ISBN format'
      }
    },
    isBorrowed: {
      type: Boolean,
      default: false
    },
    borrowedAt: {
      type: Date,
      default: null
    },
    returnedAt: {
      type: Date,
      default: null
    }
  }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });
  
  // Indexes
  bookSchema.index({ isbn: 1 });
  bookSchema.index({ title: 1 });
  bookSchema.index({ author: 1 });
  
  // Virtual for borrowing status
  bookSchema.virtual('status').get(function() {
    return this.isBorrowed ? 'Borrowed' : 'Available';
  });
  
  // Instance methods
  bookSchema.methods.borrow = function() {
    if (this.isBorrowed) {
      return false;
    }
    this.isBorrowed = true;
    this.borrowedAt = new Date();
    return true;
  };
  
  bookSchema.methods.returnBook = function() {
    if (!this.isBorrowed) {
      return false;
    }
    this.isBorrowed = false;
    this.returnedAt = new Date();
    return true;
  };
  
  bookSchema.methods.isBorrowedStatus = function() {
    return this.isBorrowed;
  };
  
  // Static methods
  bookSchema.statics.findByIsbn = function(isbn) {
    return this.findOne({ isbn });
  };
  
  bookSchema.statics.findAvailable = function() {
    return this.find({ isBorrowed: false });
  };
  
  bookSchema.statics.findBorrowed = function() {
    return this.find({ isBorrowed: true });
  };
  
  export default mongoose.model('Book', bookSchema);