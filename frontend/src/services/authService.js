// frontend/src/services/authService.js

const API_BASE_URL = 'http://localhost:3000/api/auth'; // Your backend auth API base URL

// Function to handle user registration
export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If the response is not OK, throw an error with the backend's message
      throw new Error(data.message || 'Registration failed');
    }

    return data; // Returns { success: true, message: 'User registered successfully', data: { _id, username, email, token } }
  } catch (error) {
    console.error('Frontend authService register error:', error);
    throw error; // Re-throw for component to handle
  }
};

// Function to handle user login
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data; // Returns { success: true, message: 'Logged in successfully', data: { _id, username, email, token } }
  } catch (error) {
    console.error('Frontend authService login error:', error);
    throw error;
  }
};

// Function to fetch current user data (protected route)
export const getMe = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the JWT token
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user data');
    }

    return data; // Returns { success: true, message: 'User data retrieved', data: { _id, username, email, createdAt } }
  } catch (error) {
    console.error('Frontend authService getMe error:', error);
    throw error;
  }
};

// Function to handle user logout (conceptually, backend doesn't invalidate JWTs for stateless)
export const logout = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send token for consistency, though backend might not use it
      },
      body: JSON.stringify({}), // Empty body
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }

    return data; // Returns { success: true, message: 'Logged out successfully.' }
  } catch (error) {
    console.error('Frontend authService logout error:', error);
    throw error;
  }
};
