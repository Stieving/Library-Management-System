class Book {
    #isbn; 

    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.#isbn = isbn;
        this.isBorrowed = false; 
    }


    get isbn() {
        return this.#isbn;
    }


    getTitle() {
        return this.title;
    }


    setTitle(newTitle) {
        this.title = newTitle;
    }


    getAuthor() {
        return this.author;
    }


    setAuthor(newAuthor) {
        this.author = newAuthor;
    }


    borrow() {
        if (!this.isBorrowed) {
            this.isBorrowed = true;
            return true;
        }
        return false;
    }


    returnBook() {
        if (this.isBorrowed) {
            this.isBorrowed = false;
            return true;
        }
        return false;
    }


    isBorrowedStatus() {
        return this.isBorrowed;
    }


    toString() {
        return `Book: "${this.title}" by ${this.author} (ISBN: ${this.#isbn}) - Status: ${this.isBorrowed ? 'Borrowed' : 'Available'}`;
    }
}

export default Book;