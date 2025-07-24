const API_BASE_URL = "http://localhost:3000/api/books";

export const getAllBooks = async () => {
  const response = await fetch(API_BASE_URL);
  return response.json();
};

export const getBookByIsbn = async (isbn) => {
  const response = await fetch(`${API_BASE_URL}/${isbn}`);
  return response.json();
};

export const addBook = async (book) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return response.json();
};

export const updateBook = async (isbn, updatePayload) => {
  const response = await fetch(`${API_BASE_URL}/${isbn}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatePayload),
  });
  return response.json();
};

export const deleteBook = async (isbn) => {
  const response = await fetch(`${API_BASE_URL}/${isbn}`, {
    method: "DELETE",
  });
  return response.json();
};

export const borrowBook = async (isbn) => {
  const response = await fetch(`${API_BASE_URL}/${isbn}/borrow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  return response.json();
};

export const returnBook = async (isbn) => {
  const response = await fetch(`${API_BASE_URL}/${isbn}/return`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  return response.json();
};

export const getBookStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`);
  return response.json();
};
