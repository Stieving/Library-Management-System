
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Signup from '../components/SignUp';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  // Use the useAuth hook to access the registration function
  const { register } = useAuth();
  const navigate = useNavigate();

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
        
        navigate('/login');
        
        return true;
      } else {
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
