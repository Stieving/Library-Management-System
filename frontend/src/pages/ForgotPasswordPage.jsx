// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import StaticPageWrapper from '../components/StaticPageWrapper';

const Message = ({ message, type }) => {
  if (!message) return null;

  let colorClasses = 'bg-indigo-100 text-indigo-800';
  if (type === 'success') {
    colorClasses = 'bg-green-100 text-green-800'; 
  } else if (type === 'error') {
    colorClasses = 'bg-red-100 text-red-800';
  }

  return (
    <div className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${colorClasses}`}>
      {message}
    </div>
  );
};

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Set the success message
        setMessage({
          text: 'A password reset link has been sent to your email.',
          type: 'success',
        });
        
        // Use setTimeout to clear the message after 5 seconds
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 5000);

      } else {
        // Set the message and its type to 'error'
        setMessage({
          text: data.message || 'Failed to send reset link. Please check your email and try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({
        text: 'An error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaticPageWrapper>
      <div className="flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Forgot Password</h2>
          {message.text && <Message message={message.text} type={message.type} />}
          <Loading loading={loading} />
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-center text-gray-600">
              Enter your email address to receive a password reset link.
            </p>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
              disabled={loading}
            >
              Send Reset Link
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-indigo-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </StaticPageWrapper>
  );
}

export default ForgotPasswordPage;
