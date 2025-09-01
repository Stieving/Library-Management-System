// src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleLogin = async (email, password) => {
  setLoading(true);
  setMessage('');
  try {
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setMessage('Invalid login. Please try again or register.');
    }
  } catch (error) {
    console.error("Login failed:", error);
    setMessage("Failed to log in. Please check your credentials.");
  } finally {
    setLoading(false);
  }
};


  return (
    <Login
      handlers={{ handleLogin }}
      loading={loading}
      message={message}
    />
  );
}

export default LoginPage;
