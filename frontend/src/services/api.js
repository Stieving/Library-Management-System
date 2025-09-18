// frontend/src/services/api.js
const API_BASE_URL = "http://localhost:3000/api/books";

export const getAllBooks = async (token) => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    return { success: false, message: error.message };
  }
};

export const getBookByIsbn = async (isbn, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${isbn}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getBookByIsbn:', error);
    return { success: false, message: error.message };
  }
};

export const addBook = async (bookPayload, token) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookPayload),
    });

    const data = await response.json();
    
    // Handle cases where the server returns a non-200 status code
    if (!response.ok) {
      throw new Error(data.message || 'Server error');
    }

    return data;
  } catch (error) {
    // Log the error and return a failure object
    console.error('Error in addBook utility:', error);
    return { success: false, message: error.message };
  }
};

export const updateBook = async (isbn, updatePayload, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${isbn}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatePayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    // If the response is OK, then we can safely parse the JSON.
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error in updateBook utility:', error);
    return { success: false, message: error.message };
  }
};

export const deleteBook = async (isbn, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${isbn}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    // Error handling to ensure a successful response before parsing.
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    // If the response is OK, parse the JSON.
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error in deleteBook utility:', error);
    return { success: false, message: error.message };
  }
};

export const borrowBook = async (isbn, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${isbn}/borrow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({}),
    });

    // Error handling to ensure a successful response before parsing.
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    // If the response is OK, parse the JSON.
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error in borrowBook utility:', error);
    return { success: false, message: error.message };
  }
};

export const returnBook = async (isbn, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${isbn}/return`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      // The body is an empty object, as per the original code.
      body: JSON.stringify({}),
    });

    // Error handling to check if the response was successful before parsing.
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    // If the response is OK, parse the JSON.
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error in returnBook utility:', error);
    return { success: false, message: error.message };
  }
};

export const getBookStats = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getBookStats:', error);
    return { success: false, message: error.message };
  }
};