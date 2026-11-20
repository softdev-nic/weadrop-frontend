 "use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { getRequest, postRequest } from "../../utilities/httphelper";

const DEFAULT_CATEGORIES = ["Raincoat", "Jacket", "Umbrella", "Sweater", "Footwear", "Thermal", "Cap & Hat", "Accessories", "Other"];
const DEFAULT_WEATHER = ["Rain", "Cold", "Heat", "Wind", "Snow"];
const PAYMENT_METHODS = [
  { value: "UPI", label: "UPI" },
  { value: "Card", label: "Card" },
  { value: "COD", label: "Cash on Delivery" },
];
const MAX_QTY = 20;

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

const rupees = (paise) => `₹${(paise / 100).toFixed(2)}`;

const errorText = (err, fallback) => err.response?.data?.error || err.response?.data?.message || fallback;

const ProductCard = ({ product, onAdd }) => {
  const inStock = product.variants.filter((v) => v.stock > 0);
  const [size, setSize] = React.useState(inStock[0]?.size || "");
  const [qty, setQty] = React.useState(1);
  const variant = product.variants.find((v) => v.size === size);
  const max = Math.min(MAX_QTY, variant?.stock || 0);

  return (
    <li className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {product.images?.[0] ? (
        <img src={product.images[0]} alt="" className="mb-3 h-36 w-full rounded-lg object-cover" />
      ) : (
        <div className="mb-3 flex h-36 w-full items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">No image</div>
      )}
      <p className="font-medium text-gray-900">{product.name}</p>
      <p className="text-xs text-gray-500">
        {product.vendor?.companyName}
        {product.vendor?.city ? ` · ${product.vendor.city}` : ""}
      </p>
      {product.weatherTags?.length > 0 && (
        <p className="mt-1 text-xs text-blue-700">{product.weatherTags.join(" · ")}</p>
      )}
      <p className="mt-2 text-lg font-semibold text-gray-900">{rupees(product.pricePaise)}</p>

      {inStock.length === 0 ? (
        <p className="mt-auto pt-3 text-sm text-red-600">Out of stock</p>
      ) : (
        <div className="mt-auto space-y-2 pt-3">
          <div className="flex gap-2">
            <select value={size} onChange={(e) => { setSize(e.target.value); setQty(1); }} aria-label={`Size for ${product.name}`} className={inputClass}>
              {inStock.map((v) => (
                <option key={v.size} value={v.size}>{v.size}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              max={max}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(max, Math.floor(Number(e.target.value) || 1))))}
              aria-label={`Quantity for ${product.name}`}
              className={`${inputClass} max-w-20`}
            />
          </div>
          {variant && variant.stock <= 5 && <p className="text-xs text-orange-600">Only {variant.stock} left in {size}</p>}
          <button
            type="button"
            onClick={() => onAdd(product, size, qty)}
            className="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Add to cart
          </button>
        </div>
      )}
    </li>
  );
};

const CreateOrderContent = () => {
  const router = useRouter();
  const [products, setProducts] = React.useState([]);
  const [options, setOptions] = React.useState({ categories: DEFAULT_CATEGORIES, weatherTags: DEFAULT_WEATHER });
  const [filters, setFilters] = React.useState({ weather: "", category: "", q: "" });
  const [search, setSearch] = React.useState("");
  const [cart, setCart] = React.useState([]);
  const [paymentMethod, setPaymentMethod] = React.useState("UPI");
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  React.useEffect(() => {
    if (!localStorage.getItem("authorization")) {
      router.replace("/login");
      return;
    }
    getRequest("/products/options").then(setOptions).catch(() => {});
  }, [router]);

  React.useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, q: search.trim() })), 350);
    return () => clearTimeout(t);
  }, [search]);

  React.useEffect(() => {
    if (!localStorage.getItem("authorization")) return;
    const params = new URLSearchParams();
    if (filters.weather) params.set("weather", filters.weather);
    if (filters.category) params.set("category", filters.category);
    if (filters.q) params.set("q", filters.q);

    let cancelled = false;
    setLoading(true);
    getRequest(`/products?${params.toString()}`)
      .then((res) => !cancelled && setProducts(res.products || []))
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 401) return router.replace("/login");
        setError(errorText(err, "Could not load products."));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [filters, router]);

  const cartVendor = cart[0]?.vendorId || null;

  const addToCart = (product, size, qty) => {
    setError("");
    setSuccess("");
    const vendorId = product.vendor?._id || product.vendor;
    if (cartVendor && cartVendor !== vendorId) {
      const ok = window.confirm(
        `Your cart has items from ${cart[0].vendorName}. One order can only come from one vendor. Clear the cart and add this item?`
      );
      if (!ok) return;
      setCart([]);
    }
    const stock = product.variants.find((v) => v.size === size)?.stock || 0;
    setCart((prev) => {
      const base = cartVendor && cartVendor !== vendorId ? [] : prev;
      const existing = base.find((l) => l.productId === product._id && l.size === size);
      if (existing) {
        return base.map((l) =>
          l === existing ? { ...l, quantity: Math.min(l.quantity + qty, stock, MAX_QTY) } : l
        );
      }
      return [
        ...base,
        {
          productId: product._id,
          name: product.name,
          size,
          quantity: Math.min(qty, stock, MAX_QTY),
          pricePaise: product.pricePaise,
          maxQty: Math.min(stock, MAX_QTY),
          vendorId,
          vendorName: product.vendor?.companyName || "this vendor",
        },
      ];
    });
  };

  const updateQty = (index, value) =>
    setCart((prev) =>
      prev.map((l, i) => (i === index ? { ...l, quantity: Math.max(1, Math.min(l.maxQty, Math.floor(Number(value) || 1))) } : l))
    );

  const removeLine = (index) => setCart((prev) => prev.filter((_, i) => i !== index));

  const totalPaise = cart.reduce((sum, l) => sum + l.pricePaise * l.quantity, 0);

  const placeOrder = async () => {
    setError("");
    setSuccess("");
    if (cart.length === 0) return setError("Your cart is empty.");

    setSubmitting(true);
    try {
      const res = await postRequest("/orders/place", {
        paymentMethod,
        notes: notes.trim() || undefined,
        weatherCondition: filters.weather || undefined,
        items: cart.map((l) => ({ productId: l.productId, size: l.size, quantity: l.quantity })),
      });
      const order = res.order;
      if (paymentMethod === "COD") {
        setSuccess(`Order ${order.orderNumber} placed. Pay the rider on delivery.`);
        setCart([]);
        setNotes("");
      } else {
        router.push(`/orders/${order._id}/pay`);
      }
    } catch (err) {
      if (err.response?.status === 401) return router.replace("/login");
      setError(errorText(err, "Could not place the order."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_340px]">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-black">Shop for the weather</h1>

        <div className="flex flex-wrap gap-2">
          {["", ...options.weatherTags].map((w) => {
            const on = filters.weather === w;
            return (
              <button
                key={w || "all"}
                type="button"
                onClick={() => setFilters((f) => ({ ...f, weather: w }))}
                aria-pressed={on}
                className={`rounded-full border px-3 py-1 text-sm transition ${on ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                {w || "All weather"}
              </button>
            );
          })}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" aria-label="Search products" className={inputClass} />
          <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))} aria-label="Category" className={inputClass}>
            <option value="">All categories</option>
            {options.categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-gray-500">No products match. Try another filter.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onAdd={addToCart} />
            ))}
          </ul>
        )}
      </section>

      <aside className="h-fit space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your cart</h2>
          {cart.length > 0 && <p className="text-xs text-gray-500">From {cart[0].vendorName}</p>}
        </div>

        {cart.length === 0 ? (
          <p className="text-sm text-gray-500">Add products to start an order.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {cart.map((l, i) => (
              <li key={`${l.productId}-${l.size}`} className="flex items-center gap-2 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{l.name}</p>
                  <p className="text-xs text-gray-500">Size {l.size} · {rupees(l.pricePaise)} each</p>
                </div>
                <input
                  type="number"
                  min="1"
                  max={l.maxQty}
                  value={l.quantity}
                  onChange={(e) => updateQty(i, e.target.value)}
                  aria-label={`Quantity of ${l.name}`}
                  className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                />
                <button type="button" onClick={() => removeLine(i)} aria-label={`Remove ${l.name}`} className="px-1 text-gray-400 hover:text-red-600">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div>
          <label htmlFor="payment" className="mb-1 block text-sm font-medium text-gray-700">Payment method</label>
          <select id="payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputClass}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">Notes (optional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} rows={2} placeholder="Leave at the gate" className={inputClass} />
        </div>

        <p className="text-xs text-gray-500">Delivered to the address on your profile.</p>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-lg font-semibold text-gray-900">{rupees(totalPaise)}</span>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="button"
          onClick={placeOrder}
          disabled={submitting || cart.length === 0}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Placing order…" : paymentMethod === "COD" ? "Place order" : `Place order & pay ${rupees(totalPaise)}`}
        </button>
      </aside>
    </div>
  );
};

const CreateOrderPage = () => {
  return (
    <main className="flex min-h-screen w-full justify-center bg-gray-50 px-4 py-8">
      <Suspense fallback={<p className="text-center text-gray-600">Loading...</p>}>
        <CreateOrderContent />
      </Suspense>
    </main>
  );
};

export default CreateOrderPage;