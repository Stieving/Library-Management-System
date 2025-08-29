// src/pages/EmailVerificationPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Message from '../components/Message';
import Loading from '../components/Loading';
import StaticPageWrapper from '../components/StaticPageWrapper';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        setMessage({ type: 'error', text: 'No verification token provided.' });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email?token=${token}`
        );

        if (response.data.status === 'success') {
          setMessage({ type: 'success', text: response.data.message });
          setTimeout(() => {
            navigate('/login', {
              state: {
                message: {
                  type: 'success',
                  text: 'Verification successful, kindly log in.'
                }
              }
            });
          }, 3000);
        } else {
          setMessage({ type: 'error', text: response.data.message });
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text:
            error.response?.data?.message ||
            'Verification failed. Please try again.'
        });
        console.error('Email verification error:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, navigate]);

  return (
    <StaticPageWrapper>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="p-8 bg-white shadow-lg rounded-2xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

          {loading ? (
            <Loading loading={loading} />
          ) : (
            <>
              {message && <Message message={message} />}
              {!message && (
                <p className="text-gray-600">
                  Verification successful. Kindly login.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </StaticPageWrapper>
  );
};

export default EmailVerificationPage;
