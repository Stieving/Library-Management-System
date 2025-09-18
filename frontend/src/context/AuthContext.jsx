// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginService,
  registerService,
  logoutService,
  getMeService,
} from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await fetchUser(storedToken);
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Fetch user with a token
  const fetchUser = async (userToken) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getMeService(userToken);

      if (response.success) {
        setUser(response.data);
        setIsLoggedIn(true);
      } else {
        throw new Error(response.message || 'Failed to fetch user data.');
      }
    } catch (err) {
      console.error('AuthContext fetchUser error:', err);
      // If token is invalid, clear it
      await logout();
      setError(err.message);
      toast.error('Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginService(email, password);

      if (!response.success) {
        const errorMsg = response.message || 'Login failed';
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }

      // Handle nested data structure from your API response
      const newToken = response.data?.data?.token || response.data?.token;
      
      if (!newToken) {
        const errorMsg = 'No authentication token received';
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }

      localStorage.setItem('token', newToken);
      setToken(newToken);
      await fetchUser(newToken);
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = 'Network error or login failed';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await registerService(username, email, password);

      if (!response.success) {
        const errorMsg = response.message || 'Registration failed';
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }

      // Check if registration includes auto-login with token
      const newToken = response.data?.data?.token || response.data?.token;
      
      if (newToken) {
        // Auto-login after registration
        localStorage.setItem('token', newToken);
        setToken(newToken);
        await fetchUser(newToken);
        toast.success('Account created and logged in successfully!');
      } else {
        // Registration successful but requires email verification
        toast.success('Account created! Please check your email to verify your account.');
      }
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = 'Network error or registration failed';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Call backend logout if token exists
      if (token) {
        await logoutService(token);
      }
    } catch (err) {
      console.error('Logout service error:', err);
      // Don't show error to user as logout should always succeed locally
    }

    // Clear local state regardless of backend response
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
    setLoading(false);
    
    toast.success('Logged out successfully!');
  };

  // Check if user is authenticated (useful for route protection)
  const isAuthenticated = () => {
    return isLoggedIn && user && token;
  };

  // Refresh user data (useful after profile updates)
  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  const value = {
    // State
    user,
    token,
    isLoggedIn,
    loading,
    error,
    
    // Actions
    login,
    register,
    logout,
    refreshUser,
    
    // Utilities
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};