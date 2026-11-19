"use client";

import React from "react";
import { postRequest } from "../utilities/httphelper";
import { loadRazorpay } from "../utilities/LoadRpay";

const PayButton = ({ orderId, label = "Pay now", onPaid, onFailed }) => {
  const [status, setStatus] = React.useState("idle");
  const [message, setMessage] = React.useState("");

  const fail = (text) => {
    setStatus("failed");
    setMessage(text);
    onFailed?.(text);
  };

  const handlePay = async () => {
    setStatus("loading");
    setMessage("");

    const ready = await loadRazorpay();
    if (!ready) return fail("Could not load the payment window. Check your connection.");

    let checkout;
    try {

      checkout = await postRequest("/payments/create", { orderId });
    } catch (err) {
      return fail(err.response?.data?.error || "Could not start the payment.");
    }

    const rzp = new window.Razorpay({
      key: checkout.keyId,
      order_id: checkout.razorpayOrderId,
      amount: checkout.amount,
      currency: checkout.currency,
      name: "WeaDrop",
      description: `Order ${checkout.orderNumber}`,
      prefill: checkout.prefill,
      theme: { color: "#2563eb" },

      handler: async (response) => {
        try {
          const res = await postRequest("/payments/verify", response);
          setStatus("paid");
          setMessage(res.message || "Payment successful");
          onPaid?.(res);
        } catch (err) {
          fail(err.response?.data?.error || "Payment received but not verified yet. Refresh in a minute.");
        }
      },
      modal: {
        ondismiss: () => {
          setStatus((s) => (s === "loading" ? "idle" : s));
        },
      },
    });

    rzp.on("payment.failed", (resp) => {
      fail(resp.error?.description || "Payment failed. Please try again.");
    });

    rzp.open();
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handlePay}
        disabled={status === "loading" || status === "paid"}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Opening payment…" : status === "paid" ? "Paid" : label}
      </button>
      {message && (
        <p className={`text-sm ${status === "paid" ? "text-green-600" : "text-red-600"}`}>{message}</p>
      )}
    </div>
  );
};

export default PayButton;