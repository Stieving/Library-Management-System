
import React, { useState } from 'react';
import Signup from '../components/SignUp';
import { useAuth } from '../context/AuthContext';
import StaticPageWrapper from '../components/StaticPageWrapper';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 

  /**
   * Handles the signup process. It calls the register function from the AuthContext.
   * @param {string} username - The username from the form.
   * @param {string} email - The email from the form.
   * @param {string} password - The password from the form.
   */
const handleSignup = async (username, email, password) => {
  setLoading(true);
  setMessage(null);

  try {
    const result = await register(username, email, password);
    setLoading(false);

    if (result.success) {
      // show success message and navigate
      setMessage({ type: "success", text: result.message });
      navigate("/verification-message", { state: { email } });
      return { success: true };
    } else {
      setMessage({ type: "error", text: result.message });
      return { success: false };
    }
  } catch (error) {
    setLoading(false);
    setMessage({
      type: "error",
      text: error.message || "An unexpected error occurred.",
    });
    console.error("Signup error:", error);
    return { success: false };
  }
};


  const handlers = {
    handleSignup,
    setMessage,
  };

  return (
    <StaticPageWrapper>
      <Signup
        handlers={handlers}
        loading={loading}
        message={message}
      />
    </StaticPageWrapper>
  );
};

export default SignupPage;
