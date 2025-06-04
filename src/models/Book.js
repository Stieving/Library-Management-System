class Book {
    #isbn; // Private field for ISBN (modern JS)

    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.#isbn = isbn;
        this.isBorrowed = false; // Default status
    }

    // Public getter for the private ISBN
    get isbn() {
        return this.#isbn;
    }

    // Getter for title (optional, direct access is common in JS)
    getTitle() {
        return this.title;
    }

    // Setter for title (optional, direct modification is common)
    setTitle(newTitle) {
        this.title = newTitle;
    }

    // Getter for author
    getAuthor() {
        return this.author;
    }

    // Setter for author
    setAuthor(newAuthor) {
        this.author = newAuthor;
    }

    // Method to mark a book as borrowed
    borrow() {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            return true; // Successfully borrowed
        }
        return false; // Already borrowed
    }

    // Method to mark a book as returned
    returnBook() {
        if (this.isBorrowed) {
            this.isBorrowed = false;
            return true; // Successfully returned
        }
        return false; // Not borrowed
    }

    // Method to check if the book is borrowed
    isBorrowedStatus() {
        return this.isBorrowed;
    }

    // toString equivalent for logging/display
    toString() {
        return `Book: "${this.title}" by ${this.author} (ISBN: ${this.#isbn}) - Status: ${this.isBorrowed ? 'Borrowed' : 'Available'}`;
    }
}

export default Book;