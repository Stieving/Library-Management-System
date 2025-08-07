import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import Signup from '../components/Signup'; // Corrected import path
import { useAuth } from '../context/AuthContext'; // Corrected import path

const SignupPage = () => {
  // Use the useAuth hook to access the registration function
  const { register } = useAuth();
  // Initialize the navigate function from react-router-dom
  const navigate = useNavigate();

  // State to manage the loading indicator and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  /**
   * Handles the signup process. It calls the register function from the AuthContext.
   * @param {string} username - The username from the form.
   * @param {string} email - The email from the form.
   * @param {string} password - The password from the form.
   * @returns {Promise<boolean>} A promise that resolves to true on success, false on failure.
   */
  const handleSignup = async (username, email, password) => {
    setLoading(true);
    setMessage('');
    try {
      const success = await register(username, email, password);
      setLoading(false);
      if (success) {
        setMessage({ type: 'success', text: 'Signup successful! Redirecting to login...' });
        // The success is now tied to a token being set in localStorage
        // and a user being fetched, as per your App.jsx
        
        // This is the crucial part: navigate to the login page on success.
        navigate('/login');
        
        return true;
      } else {
        // The register function likely returns false on failure
        setMessage({ type: 'error', text: 'Signup failed. Please try again.' });
        return false;
      }
    } catch (error) {
      setLoading(false);
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
      console.error('Signup error:', error);
      return false;
    }
  };

  const handlers = {
    handleSignup,
  };

  return (
    <Signup
      handlers={handlers}
      loading={loading}
      message={message}
    />
  );
};

export default SignupPage;
