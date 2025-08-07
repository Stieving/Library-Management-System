// src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login'; // Import the Login component
import { AuthContext } from '../context/AuthContext'; // We'll assume you have this context for now

/**
 * LoginPage is a page component that manages the state for the login process
 * and renders the Login component.
 */
function LoginPage() {
  // Use state hooks to manage loading and message states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext); // Get the login function from AuthContext
  const navigate = useNavigate();

  // This function will be passed as a handler to the Login component
  const handleLogin = async (email, password) => {
    setLoading(true);
    setMessage('');
    try {
      // Call the login function from the context
      await login(email, password);
      // If login is successful, navigate to the homepage
      navigate('/');
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setMessage(error.message || "Failed to log in. Please check your credentials.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Login
      handlers={{ handleLogin }} // Pass the handler function to the component
      loading={loading}
      message={message}
    />
  );
}

export default LoginPage;
