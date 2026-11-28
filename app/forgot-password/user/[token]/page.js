"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { postRequest } from "../../../utilities/httphelper";

const MIN_LENGTH = 8; // matches the backend rule

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";
const linkClass = "text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline";

const ResetPasswordContent = () => {
  const { token } = useParams();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [status, setStatus] = React.useState("idle");
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < MIN_LENGTH) {
      setStatus("error");
      return setMessage(`Password must be at least ${MIN_LENGTH} characters.`);
    }
    if (password !== confirm) {
      setStatus("error");
      return setMessage("Passwords do not match.");
    }

    setStatus("loading");
    setMessage("");
    try {
      const res = await postRequest(`/user/reset-password/${encodeURIComponent(token)}`, { password });
      setStatus("success");
      setMessage(res?.success || res?.message || "Your password has been reset.");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.error || err.response?.data?.message || "Could not reset your password.");
    }
  };

  if (status === "success") {
    return (
      <div className="space-y-6 text-center">
        <p className="text-sm text-green-600">{message}</p>
        <Link href="/login" className={linkClass}>
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">New password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={`At least ${MIN_LENGTH} characters`}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm" className="text-sm font-medium text-gray-700">Confirm new password</label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type it again"
            className={inputClass}
          />
        </div>

        {status === "error" && <p className="text-sm text-red-600">{message}</p>}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Resetting…" : "Reset password"}
        </button>
      </form>
      <p className="mt-6 text-center">
        <Link href="/forgot-password/user/request" className={linkClass}>
          Link expired? Request a new one
        </Link>
      </p>
    </>
  );
};

const ResetPasswordPage = () => {
  return (
    <main className="container flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg">
        <h1 className="mb-6 text-center text-xl font-semibold text-black">Reset password</h1>
        <Suspense fallback={<p className="text-center text-gray-600">Loading...</p>}>
          <ResetPasswordContent />
        </Suspense>
      </section>
    </main>
  );
};

export default ResetPasswordPage;