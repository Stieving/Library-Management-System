// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginService,
  registerService,
  logoutService,
  getMeService,
} from "../services/authService";

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
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
      console.error("AuthContext fetchUser error:", err);
      logout();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password);
      if (!data.success) {
        console.error("Login failed:", data.message);
        return false;
      }

      const token = data.data.token;
      if (!token) {
        console.error("No token received");
        return false;
      }

      localStorage.setItem("token", token);
      setToken(token);
      await fetchUser(token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const data = await registerService(username, email, password);
      if (!data.success) {
        console.error("Signup failed:", data.message);
        return false;
      }
      console.log("Signup successful:", data);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    logoutService(token);
    localStorage.removeItem("token");
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
