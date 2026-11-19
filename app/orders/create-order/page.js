 "use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { getRequest, postRequest } from "../../utilities/httphelper";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free size"];
const WEATHER = ["", "Rain", "Cold", "Heat", "Wind", "Snow"];
const PAYMENT_METHODS = [
  { value: "UPI", label: "UPI" },
  { value: "Card", label: "Card" },
  { value: "COD", label: "Cash on Delivery" },
];

const emptyItem = () => ({ name: "", size: "M", quantity: 1, unitPrice: "" });

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const CreateOrderContent = () => {
  const router = useRouter();
  const [vendors, setVendors] = React.useState([]);
  const [vendorId, setVendorId] = React.useState("");
  const [items, setItems] = React.useState([emptyItem()]);
  const [paymentMethod, setPaymentMethod] = React.useState("UPI");
  const [weatherCondition, setWeatherCondition] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [loadingVendors, setLoadingVendors] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  React.useEffect(() => {
    if (!localStorage.getItem("authorization")) {
      router.replace("/login");
      return;
    }
    const load = async () => {
      try {
        const res = await getRequest("/vendors");
        setVendors(res.vendors || []);
      } catch (err) {
        if (err.response?.status === 401) return router.replace("/login");
        setError(err.response?.data?.error || "Could not load vendors.");
      } finally {
        setLoadingVendors(false);
      }
    };
    load();
  }, [router]);

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const total = items.reduce(
    (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
    0
  );

  const validate = () => {
    if (!vendorId) return "Choose a vendor.";
    for (const [n, i] of items.entries()) {
      if (!i.name.trim()) return `Item ${n + 1} needs a name.`;
      if (!Number.isInteger(Number(i.quantity)) || Number(i.quantity) < 1)
        return `Item ${n + 1} needs a quantity of 1 or more.`;
      if (i.unitPrice === "" || Number(i.unitPrice) < 0) return `Item ${n + 1} needs a valid price.`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const problem = validate();
    if (problem) return setError(problem);

    setSubmitting(true);
    try {
      const res = await postRequest("/orders/place", {
        vendorId,
        paymentMethod,
        weatherCondition: weatherCondition || undefined,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({
          name: i.name.trim(),
          size: i.size,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
      });

      const order = res.order;
      if (paymentMethod === "COD") {
        setSuccess(`Order ${order.orderNumber} placed. Pay the rider on delivery.`);
        setItems([emptyItem()]);
        setNotes("");
      } else {
        router.push(`/orders/${order._id}/pay`);
      }
    } catch (err) {
      if (err.response?.status === 401) return router.replace("/login");
      setError(err.response?.data?.error || err.response?.data?.message || "Could not place the order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h1 className="text-xl font-semibold text-black">New order</h1>
        <p className="mt-1 text-sm text-gray-500">Delivered to the address on your profile.</p>
      </div>

      <div>
        <label htmlFor="vendor" className={labelClass}>Vendor</label>
        <select
          id="vendor"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className={inputClass}
          disabled={loadingVendors}
        >
          <option value="">{loadingVendors ? "Loading vendors…" : "Choose a vendor"}</option>
          {vendors.map((v) => (
            <option key={v._id} value={v._id}>
              {v.companyName}{v.city ? ` — ${v.city}` : ""}
            </option>
          ))}
        </select>
        {!loadingVendors && vendors.length === 0 && (
          <p className="mt-1 text-sm text-gray-500">No vendors yet. Register an organization of type Vendor first.</p>
        )}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-gray-700">Items</legend>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 rounded-lg border border-gray-200 p-3">
            <div className="col-span-12 sm:col-span-5">
              <label className="mb-1 block text-xs text-gray-500">Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                placeholder="Raincoat"
                className={inputClass}
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-500">Size</label>
              <select
                value={item.size}
                onChange={(e) => updateItem(index, "size", e.target.value)}
                className={inputClass}
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-500">Qty</label>
              <input
                type="number"
                min="1"
                step="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-500">Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                placeholder="499"
                className={inputClass}
              />
            </div>
            <div className="col-span-12 flex items-end sm:col-span-1">
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Remove item ${index + 1}`}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="rounded-lg border border-dashed border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          + Add item
        </button>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="payment" className={labelClass}>Payment method</label>
          <select
            id="payment"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={inputClass}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="weather" className={labelClass}>Weather (optional)</label>
          <select
            id="weather"
            value={weatherCondition}
            onChange={(e) => setWeatherCondition(e.target.value)}
            className={inputClass}
          >
            {WEATHER.map((w) => (
              <option key={w} value={w}>{w || "Not specified"}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={300}
          rows={3}
          placeholder="Leave at the gate"
          className={inputClass}
        />
        <p className="mt-1 text-right text-xs text-gray-400">{notes.length}/300</p>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-600">Total</span>
        <span className="text-lg font-semibold text-gray-900">₹{total.toFixed(2)}</span>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting
          ? "Placing order…"
          : paymentMethod === "COD"
          ? "Place order"
          : `Place order & pay ₹${total.toFixed(2)}`}
      </button>
    </form>
  );
};

const CreateOrderPage = () => {
  return (
    <main className="flex min-h-screen w-full items-start justify-center bg-gray-50 px-4 py-8">
      <Suspense fallback={<p className="text-center text-gray-600">Loading...</p>}>
        <CreateOrderContent />
      </Suspense>
    </main>
  );
};

export default CreateOrderPage;