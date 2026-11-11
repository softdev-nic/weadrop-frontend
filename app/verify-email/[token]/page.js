 "use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getRequest } from "../../utilities/httphelper";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const started = useRef(false);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (started.current) return; // stops the double call in dev Strict Mode
    started.current = true;

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the URL.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await getRequest(`/user/verify/${token}`);
        setStatus("success");
        setMessage(
          response?.message ||
            "Your email has been verified. You can now log in."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Unable to verify your email. Please try again or contact support."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <main className="container flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg rounded-lg border border-gray-200 bg-gray-50 p-8 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold text-black">
          Verify Email
        </h1>
        <p
          className={`text-center ${
            status === "error"
              ? "text-red-600"
              : status === "success"
              ? "text-green-600"
              : "text-gray-600"
          }`}
        >
          {message}
        </p>
        {status === "success" && (
          <p className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Go to login
            </a>
          </p>
        )}
      </section>
    </main>
  );
};

export default VerifyEmailPage;