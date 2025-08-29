// src/pages/VerificationMessagePage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';   // ✅ import
import StaticPageWrapper from '../components/StaticPageWrapper';
import Message from '../components/Message';
import Loading from '../components/Loading';

const VerificationMessagePage = () => {
  const location = useLocation();
  const initialEmail = location.state?.email || ''; // ✅ get email from signup

  const [email, setEmail] = useState(initialEmail);  // ✅ pre-fill email
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [countdown, setCountdown] = useState(0);

  // countdown effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`http://localhost:3000/api/auth/resend-verification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        setCountdown(30);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to resend verification email.' });
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaticPageWrapper>
      <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Verify Your Email
          </h2>

          <p className="text-gray-700 text-center mb-2">
            A verification link has been sent to your email. Click on the link to verify your account.
          </p>
          <p className="text-gray-500 text-sm text-center mb-4">
            Didn’t receive an email? Enter your email below and click resend.
          </p>

          {message && <Message message={message} />}
          <Loading loading={loading} />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleResend();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || countdown > 0}
              className={`w-full py-2 rounded-lg font-bold transition-colors ${
                loading || countdown > 0
                  ? 'bg-indigo-300 text-white cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {countdown > 0 ? `Resend link in ${countdown}s` : 'Resend Verification Link'}
            </button>
          </form>
        </div>
      </div>
    </StaticPageWrapper>
  );
};

export default VerificationMessagePage;
