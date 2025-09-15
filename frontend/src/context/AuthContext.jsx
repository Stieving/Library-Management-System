// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginService,
  registerService,
  logoutService,
  getMeService,
} from '../services/authService';

const API_BASE_URL = 'http://localhost:3000/api'; // still here if needed

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user with a token
  const fetchUser = async (userToken) => {
    try {
      setLoading(true);
      const response = await getMeService(userToken);

      if (response.success) {
        setUser(response.data);
        setIsLoggedIn(true);
        setError(null);
      } else {
        throw new Error(response.message || 'Failed to fetch user data.');
      }
    } catch (err) {
      console.error('AuthContext fetchUser error:', err);
      logout();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const data = await loginService(email, password);

      if (!data.success) {
        console.error('Login failed:', data.message);
        return false;
      }

      const token = data.data?.token;
      if (!token) {
        console.error('No token received');
        return false;
      }

      localStorage.setItem('token', token);
      setToken(token);
      await fetchUser(token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Register (no auto-login, since verification required)
  const register = async (username, email, password) => {
    try {
      const data = await registerService(username, email, password);

      if (!data.success) {
        console.error('Signup failed:', data.message);
        return false;
      }

      console.log('Signup successful:', data);
      return true; // let frontend show "check your email"
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutService(token); // in case backend needs cleanup
    } catch (err) {
      console.error('Logout service error:', err);
    }

    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
    setLoading(false);
  };

  const value = {
    user,
    token,
    isLoggedIn,
    loading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, useAuth };
