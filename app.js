// app.js

// Import the Express.js framework
import express from 'express';

// Import your Book and Library classes.
// The paths are relative to this app.js file.
// Ensure your Book.js is in src/models/ and Library.js is in src/services/
import Book from './src/models/Book.js';
import Library from './src/services/Library.js';

// Create an Express application instance
const app = express();
// Define the port number your server will listen on
const port = 3000;

// Initialize the Library instance. This will hold our in-memory book data.
const myLibrary = new Library();

// --- Pre-populate the library with some books for testing purposes ---
// This ensures you have data to work with immediately when you start the API.
const book1 = new Book("The Great Gatsby", "F. Scott Fitzgerald", "978-0743273565");
const book2 = new Book("1984", "George Orwell", "978-0451524935");
const book3 = new Book("To Kill a Mockingbird", "Harper Lee", "978-0061120084");
const book4 = new Book("Pride and Prejudice", "Jane Austen", "978-0141439518");
const book5 = new Book("The Catcher in the Rye", "J.D. Salinger", "978-0316769174");

myLibrary.addBook(book1);
myLibrary.addBook(book2);
myLibrary.addBook(book3);
myLibrary.addBook(book4);
myLibrary.addBook(book5);

// Middleware to parse JSON bodies from incoming requests.
// This is crucial for handling data sent from clients (like your frontend or Postman)
// when they send JSON in the request body (e.g., for POST requests).
app.use(express.json());

// --- API Endpoints for Library Management System ---

// 1. GET all books
// Endpoint: GET /api/books
// Description: Retrieves a list of all books currently in the library.
app.get('/api/books', (req, res) => {
    // Convert the Map of books (myLibrary.books) into an array of book objects.
    // This is because JSON.stringify (which res.json uses) works best with arrays or plain objects.
    const allBooks = Array.from(myLibrary.books.values());
    // Send the array of book objects as a JSON response.
    res.json(allBooks);
});

// 2. GET a single book by ISBN
// Endpoint: GET /api/books/:isbn
// Description: Retrieves details for a specific book using its ISBN.
app.get('/api/books/:isbn', (req, res) => {
    // Extract the ISBN from the URL parameters (e.g., /api/books/978-0743273565)
    const isbn = req.params.isbn;
    // Use the Library's findBookByIsbn method to get the book object.
    const book = myLibrary.findBookByIsbn(isbn);

    // Check if the book was found.
    if (book) {
        // If found, send the book object as a JSON response with a 200 OK status (default).
        res.json(book);
    } else {
        // If not found, send a 404 Not Found status with a descriptive message.
        res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

// 3. POST to add a new book
// Endpoint: POST /api/books
// Description: Adds a new book to the library.
// Request Body (JSON): { "title": "...", "author": "...", "isbn": "..." }
app.post('/api/books', (req, res) => {
    // Destructure title, author, and isbn from the request body.
    // express.json() middleware parses the JSON body and makes it available on req.body.
    const { title, author, isbn } = req.body;

    // Basic server-side validation: Check if all required fields are present.
    if (!title || !author || !isbn) {
        // If any required field is missing, send a 400 Bad Request status.
        return res.status(400).json({ message: 'Title, author, and ISBN are required to add a book.' });
    }

    // Create a new Book instance with the provided data.
    const newBook = new Book(title, author, isbn);
    // Attempt to add the book to the library using the Library's addBook method.
    const added = myLibrary.addBook(newBook);

    // Check if the book was successfully added (i.e., no duplicate ISBN).
    if (added) {
        // If added, send a 201 Created status and the newly added book object as JSON.
        res.status(201).json(newBook);
    } else {
        // If addBook returned false (meaning ISBN already exists), send a 409 Conflict status.
        res.status(409).json({ message: `Book with ISBN ${isbn} already exists.` });
    }
});

// 4. POST to borrow a book
// Endpoint: POST /api/books/:isbn/borrow
// Description: Marks a specific book as borrowed.
app.post('/api/books/:isbn/borrow', (req, res) => {
    // Get the ISBN from the URL parameters.
    const isbn = req.params.isbn;

    // Attempt to borrow the book using the Library's borrowBook method.
    const borrowed = myLibrary.borrowBook(isbn);

    // Check the result of the borrow operation.
    if (borrowed) {
        // If successful, retrieve the updated book object to send in the response.
        const book = myLibrary.findBookByIsbn(isbn);
        // Send a 200 OK status with a success message and the updated book details.
        res.json({ message: `Book "${book.title}" borrowed successfully.`, book });
    } else {
        // If not successful, determine the reason for the failure.
        const book = myLibrary.findBookByIsbn(isbn);
        if (book && book.isBorrowedStatus()) {
            // If the book exists and is already borrowed, send a 409 Conflict.
            res.status(409).json({ message: `Book "${book.title}" is already borrowed.` });
        } else {
            // If the book was not found, send a 404 Not Found.
            res.status(404).json({ message: `Book with ISBN ${isbn} not found or cannot be borrowed.` });
        }
    }
});

// 5. POST to return a book
// Endpoint: POST /api/books/:isbn/return
// Description: Marks a specific book as returned.
app.post('/api/books/:isbn/return', (req, res) => {
    // Get the ISBN from the URL parameters.
    const isbn = req.params.isbn;

    // Attempt to return the book using the Library's returnBook method.
    const returned = myLibrary.returnBook(isbn);

    // Check the result of the return operation.
    if (returned) {
        // If successful, retrieve the updated book object to send in the response.
        const book = myLibrary.findBookByIsbn(isbn);
        // Send a 200 OK status with a success message and the updated book details.
        res.json({ message: `Book "${book.title}" returned successfully.`, book });
    } else {
        // If not successful, determine the reason for the failure.
        const book = myLibrary.findBookByIsbn(isbn);
        if (book && !book.isBorrowedStatus()) {
            // If the book exists but was not borrowed, send a 409 Conflict.
            res.status(409).json({ message: `Book "${book.title}" was not borrowed.` });
        } else {
            // If the book was not found, send a 404 Not Found.
            res.status(404).json({ message: `Book with ISBN ${isbn} not found or cannot be returned.` });
        }
    }
});

// Start the server and listen for incoming requests on the defined port.
app.listen(port, () => {
    console.log(`LMS API listening at http://localhost:${port}`);
});
