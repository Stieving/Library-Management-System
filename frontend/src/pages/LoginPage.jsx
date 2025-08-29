// src/pages/LoginPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../components/Login';
import { AuthContext } from '../context/AuthContext';
import StaticPageWrapper from '../components/StaticPageWrapper';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get("verified");
    const msg = params.get("message");

    if (verified === "true") {
      setMessage({ type: "success", text: "Verification successful, kindly log in." });
    } else if (verified === "false") {
      setMessage({ type: "error", text: msg || "Email verification failed. Please try again." });
    }
  }, [location]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setMessage(null);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setMessage({ type: "error", text: "Invalid login. Please try again or register." });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setMessage({ type: "error", text: "Failed to log in. Please check your credentials." });
    } finally {
      setLoading(false);
    }
  } catch (error) {
    console.error("Login failed:", error);
    setMessage("Failed to log in. Please check your credentials.");
  } finally {
    setLoading(false);
  }
};


  return (
    <StaticPageWrapper>
      <Login
        handlers={{ handleLogin }}
        loading={loading}
        message={message}
      />
    </StaticPageWrapper>
  );


export default LoginPage;