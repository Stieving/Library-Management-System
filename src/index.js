import Book from '/models/Book.js';
import Library from '/services/Library.js';


const myLibrary = new Library();


const book1 = new Book("The Great Gatsby", "F. Scott Fitzgerald", "978-0743273565");
const book2 = new Book("1984", "George Orwell", "978-0451524935");
const book3 = new Book("To Kill a Mockingbird", "Harper Lee", "978-0061120084");


myLibrary.addBook(book1);
myLibrary.addBook(book2);
myLibrary.addBook(book3);
myLibrary.addBook(new Book("The Great Gatsby", "F. Scott Fitzgerald", "978-0743273565")); // Attempt to add duplicate

// List all books
myLibrary.listAllBooks();

// Borrow a book
myLibrary.borrowBook("978-0451524935"); 
myLibrary.borrowBook("978-0451524935"); 

// List books to see a change in the status of ghe books
myLibrary.listAllBooks();

// Return a book
myLibrary.returnBook("978-0451524935"); 
myLibrary.returnBook("978-0451524935"); 

// List books after returning them
myLibrary.listAllBooks();

// Trying to borrow a book that doesn't exist
myLibrary.borrowBook("999-9999999999");