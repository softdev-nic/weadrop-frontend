"use client";

import Link from "next/link";
import Form from "../../../components/Form";
import { postRequest } from "../../../utilities/httphelper";

const fields = [
  { id: "email", label: "Email", type: "email", name: "email", placeholder: "Enter your registered email", required: true },
];

// the backend replies with "success" instead of "message"
const requestReset = async (data, url) => {
  const res = await postRequest(url, data);
  return { message: res?.success || res?.message || "If the account exists, a reset link has been sent." };
};

const ForgotPassword = () => {
  return (
    <main className="container flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg">
        <h1 className="mb-2 text-center text-xl font-semibold text-black">Forgot password</h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your email and we&apos;ll send you a link to reset your password. The link is valid for 15 minutes.
        </p>
        <Form inputs={fields} url="/user/forgot-password" atSubmit={requestReset} submitLabel="Send reset link" />
        <p className="mt-6 text-center">
          <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
