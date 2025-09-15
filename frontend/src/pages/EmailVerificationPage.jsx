// src/pages/EmailVerificationPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import StaticPageWrapper from "../components/StaticPageWrapper";

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        toast.error("No verification token provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email?token=${token}`
        );

        if (response.data.status === "success") {
          toast.success("Verification successful, kindly log in.");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.error(response.data.message || "Verification failed.");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Verification failed. Please try again."
        );
        console.error("Email verification error:", error);
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
            <p className="text-gray-600">
              Please check the toast notification for status.
            </p>
          )}
        </div>
      </div>
    </StaticPageWrapper>
  );
};

export default EmailVerificationPage;
