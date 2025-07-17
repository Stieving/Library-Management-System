import Book from '../models/Book.js';

class Library {
    constructor() {
        // Using a Map for efficient lookup by ISBN, similar to Java's HashMap
        this.books = new Map();
    }

    /**
     * Adds a new book to the library.
     * @param {Book} book The book object to add.
     * @returns {boolean} True if the book was added, false if ISBN already exists.
     */
    addBook(book) {
        if (this.books.has(book.isbn)) {
            console.warn(`Book with ISBN ${book.isbn} already exists.`);
            return false;
        }
        this.books.set(book.isbn, book);
        console.log(`Added: ${book.title}`);
        return true;
    }

    /**
     * Finds a book by its ISBN.
     * @param {string} isbn The ISBN of the book to find.
     * @returns {Book | undefined} The book object if found, otherwise undefined.
     */
    findBookByIsbn(isbn) {
        return this.books.get(isbn);
    }

    /**
     * Borrows a book.
     * @param {string} isbn The ISBN of the book to borrow.
     * @returns {boolean} True if borrowed successfully, false otherwise.
     */
    borrowBook(isbn) {
        const book = this.findBookByIsbn(isbn);
        if (book) {
            if (book.borrow()) {
                console.log(`Successfully borrowed: ${book.title}`);
                return true;
            } else {
                console.warn(`${book.title} is already borrowed.`);
            }
        } else {
            console.error(`Book with ISBN ${isbn} not found.`);
        }
        return false;
    }

    /**
     * Returns a borrowed book.
     * @param {string} isbn The ISBN of the book to return.
     * @returns {boolean} True if returned successfully, false otherwise.
     */
    returnBook(isbn) {
        const book = this.findBookByIsbn(isbn);
        if (book) {
            if (book.returnBook()) {
                console.log(`Successfully returned: ${book.title}`);
                return true;
            } else {
                console.warn(`${book.title} was not borrowed.`);
            }
        } else {
            console.error(`Book with ISBN ${isbn} not found.`);
        }
        return false;
    }

    /**
     * Lists all books in the library.
     */
    listAllBooks() {
        if (this.books.size === 0) {
            console.log("The library is empty.");
            return;
        }
        console.log("\n--- Current Library Books ---");
        this.books.forEach(book => {
            console.log(book.toString());
        });
        console.log("-----------------------------\n");
    }
}

export default Library;