// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getMe as getMeService } from '../services/authService';

const AuthContext = createContext();

// This is the hook that AppContent needs to use
const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (userToken) => {
    try {
      setLoading(true);
      const response = await getMeService(userToken);
      if (response.success) {
        setUser(response.data);
        setIsLoggedIn(true);
        setError(null);
      } else {
        throw new Error(response.message || "Failed to fetch user data.");
      }
    } catch (err) {
      console.error('AuthContext fetchUser error:', err);
      logout();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(email, password);
      if (response.success) {
        const newToken = response.data.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        fetchUser(newToken);
      } else {
        throw new Error(response.message || "Login failed.");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerService(username, email, password);
      if (response.success) {
        const newToken = response.data.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        fetchUser(newToken);
      } else {
        throw new Error(response.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const logout = () => {
    logoutService(token);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider, useAuth };
