 "use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRequest } from "../../../utilities/httphelper";
import PayButton from "../../../components/PayButton";

const PayOrderContent = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = React.useState(null);
  const [error, setError] = React.useState("");

  const loadStatus = React.useCallback(async () => {
    try {
      setOrder(await getRequest(`/payments/status/${id}`));
    } catch (err) {
      if (err.response?.status === 401) return router.replace("/login");
      setError(err.response?.data?.error || "Could not load this order.");
    }
  }, [id, router]);

  React.useEffect(() => {
    if (!localStorage.getItem("authorization")) {
      router.replace("/login");
      return;
    }
    loadStatus();
  }, [loadStatus, router]);

  return (
    <section className="w-full max-w-md space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-black">Pay for your order</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {!order && !error && <p className="text-sm text-gray-500">Loading…</p>}

      {order && (
        <>
          <dl className="divide-y divide-gray-100 text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-gray-600">Order</dt>
              <dd className="font-medium text-gray-900">{order.orderNumber}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-gray-600">Amount</dt>
              <dd className="font-medium text-gray-900">₹{Number(order.total).toFixed(2)}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-gray-600">Payment status</dt>
              <dd className="font-medium text-gray-900">{order.status}</dd>
            </div>
          </dl>

          {order.method === "COD" ? (
            <p className="text-sm text-gray-600">This order is Cash on Delivery. Pay the rider on arrival.</p>
          ) : order.status === "Paid" ? (
            <p className="text-sm text-green-600">This order is paid. Thank you!</p>
          ) : (
            <PayButton orderId={id} label={`Pay ₹${Number(order.total).toFixed(2)}`} onPaid={loadStatus} />
          )}
        </>
      )}
    </section>
  );
};

const PayOrderPage = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-8">
      <Suspense fallback={<p className="text-center text-gray-600">Loading order...</p>}>
        <PayOrderContent />
      </Suspense>
    </main>
  );
};

export default PayOrderPage;