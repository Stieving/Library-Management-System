import Book from './models/Book.js';

class Library {
    constructor() {
        this.books = new Map();
    }

    addBook(book) {
        if (this.books.has(book.isbn)) {
            console.warn(`Book with ISBN ${book.isbn} already exists.`);
            return false;
        }
        this.books.set(book.isbn, book);
        console.log(`Added: ${book.title}`);
        return true;
    }


    findBookByIsbn(isbn) {
        return this.books.get(isbn);
    }


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