"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { getRequest, postRequest, putRequest, deleteRequest } from "../../utilities/httphelper";

const DEFAULT_CATEGORIES = ["Raincoat", "Jacket", "Umbrella", "Sweater", "Footwear", "Thermal", "Cap & Hat", "Accessories", "Other"];
const DEFAULT_WEATHER = ["Rain", "Cold", "Heat", "Wind", "Snow"];

const emptyForm = () => ({
  name: "",
  description: "",
  category: "",
  weatherTags: [],
  price: "",
  imageUrl: "",
  variants: [{ size: "M", stock: 10 }],
  isActive: true,
});

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const errorText = (err, fallback) => err.response?.data?.error || err.response?.data?.message || fallback;

const VendorProductsContent = () => {
  const router = useRouter();
  const [vendorName, setVendorName] = React.useState("");
  const [products, setProducts] = React.useState([]);
  const [options, setOptions] = React.useState({ categories: DEFAULT_CATEGORIES, weatherTags: DEFAULT_WEATHER });
  const [form, setForm] = React.useState(emptyForm());
  const [editingId, setEditingId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [forbidden, setForbidden] = React.useState("");
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  const loadProducts = React.useCallback(async () => {
    try {
      const res = await getRequest("/products/mine");
      setVendorName(res.vendor?.companyName || "");
      setProducts(res.products || []);
    } catch (err) {
      if (err.response?.status === 401) return router.replace("/login");
      if (err.response?.status === 403) return setForbidden(errorText(err, "Only Vendor organizations can manage products."));
      setError(errorText(err, "Could not load your products."));
    } finally {
      setLoading(false);
    }
  }, [router]);

  React.useEffect(() => {
    if (!localStorage.getItem("authorization")) {
      router.replace("/login");
      return;
    }
    getRequest("/products/options").then(setOptions).catch(() => {});
    loadProducts();
  }, [loadProducts, router]);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleTag = (tag) =>
    setForm((f) => ({
      ...f,
      weatherTags: f.weatherTags.includes(tag) ? f.weatherTags.filter((t) => t !== tag) : [...f.weatherTags, tag],
    }));

  const setVariant = (index, field, value) =>
    setForm((f) => ({ ...f, variants: f.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)) }));

  const addVariant = () => setForm((f) => ({ ...f, variants: [...f.variants, { size: "", stock: 0 }] }));

  const removeVariant = (index) => setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }));

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description || "",
      category: p.category,
      weatherTags: p.weatherTags || [],
      price: String(p.pricePaise / 100),
      imageUrl: p.images?.[0] || "",
      variants: p.variants.map((v) => ({ size: v.size, stock: v.stock })),
      isActive: p.isActive,
    });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = () => {
    if (!form.name.trim()) return "Enter a product name.";
    if (!form.category) return "Choose a category.";
    if (!(Number(form.price) >= 1)) return "Price must be at least ₹1.";
    const sizes = form.variants.filter((v) => v.size.trim());
    if (sizes.length === 0) return "Add at least one size.";
    if (new Set(sizes.map((v) => v.size.trim().toLowerCase())).size !== sizes.length) return "Each size can be listed only once.";
    if (form.imageUrl && !/^https?:\/\//i.test(form.imageUrl.trim())) return "Image URL must start with http:// or https://";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    const problem = validate();
    if (problem) return setError(problem);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      weatherTags: form.weatherTags,
      price: Number(form.price),
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      variants: form.variants
        .filter((v) => v.size.trim())
        .map((v) => ({ size: v.size.trim(), stock: Math.max(0, Math.floor(Number(v.stock) || 0)) })),
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (editingId) {
        await putRequest(`/products/${editingId}`, payload);
        setNotice("Product updated.");
      } else {
        await postRequest("/products", payload);
        setNotice("Product added.");
      }
      resetForm();
      await loadProducts();
    } catch (err) {
      if (err.response?.status === 401) return router.replace("/login");
      setError(errorText(err, "Could not save the product."));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p) => {
    try {
      await putRequest(`/products/${p._id}`, { isActive: !p.isActive });
      await loadProducts();
    } catch (err) {
      setError(errorText(err, "Could not update the product."));
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await deleteRequest(`/products/${p._id}`);
      if (editingId === p._id) resetForm();
      await loadProducts();
    } catch (err) {
      setError(errorText(err, "Could not delete the product."));
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading products...</p>;

  if (forbidden) {
    return (
      <section className="w-full max-w-md space-y-3 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-black">My products</h1>
        <p className="text-sm text-gray-600">{forbidden}</p>
        <a href="/organization/register" className="inline-block text-sm font-medium text-blue-600 hover:underline">
          Register a Vendor organization
        </a>
      </section>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-black">My products</h1>
        {vendorName && <p className="text-sm text-gray-500">{vendorName}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{editingId ? "Edit product" : "Add a product"}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>Name</label>
            <input id="name" value={form.name} onChange={(e) => setField("name", e.target.value)} maxLength={100} placeholder="Waterproof raincoat" className={inputClass} />
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select id="category" value={form.category} onChange={(e) => setField("category", e.target.value)} className={inputClass}>
              <option value="">Choose a category</option>
              {options.categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description (optional)</label>
          <textarea id="description" value={form.description} onChange={(e) => setField("description", e.target.value)} maxLength={500} rows={2} className={inputClass} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className={labelClass}>Price (₹)</label>
            <input id="price" type="number" min="1" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="499" className={inputClass} />
          </div>
          <div>
            <label htmlFor="image" className={labelClass}>Image URL (optional)</label>
            <input id="image" type="url" value={form.imageUrl} onChange={(e) => setField("imageUrl", e.target.value)} placeholder="https://..." className={inputClass} />
          </div>
        </div>

        <div>
          <span className={labelClass}>Good for weather</span>
          <div className="flex flex-wrap gap-2">
            {options.weatherTags.map((tag) => {
              const on = form.weatherTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={on}
                  className={`rounded-full border px-3 py-1 text-sm transition ${on ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className={labelClass}>Sizes and stock</legend>
          {form.variants.map((v, i) => (
            <div key={i} className="flex gap-2">
              <input value={v.size} onChange={(e) => setVariant(i, "size", e.target.value)} placeholder="Size (e.g. M)" aria-label={`Size ${i + 1}`} className={inputClass} />
              <input type="number" min="0" step="1" value={v.stock} onChange={(e) => setVariant(i, "stock", e.target.value)} aria-label={`Stock for size ${i + 1}`} className={`${inputClass} max-w-28`} />
              <button type="button" onClick={() => removeVariant(i)} disabled={form.variants.length === 1} aria-label={`Remove size ${i + 1}`} className="rounded-lg border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="rounded-lg border border-dashed border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            + Add size
          </button>
        </fieldset>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setField("isActive", e.target.checked)} className="h-4 w-4" />
          Visible to customers
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {notice && <p className="text-sm text-green-600">{notice}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving…" : editingId ? "Save changes" : "Add product"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Your catalogue ({products.length})</h2>
        {products.length === 0 && <p className="text-sm text-gray-500">No products yet. Add your first one above.</p>}
        <ul className="grid gap-3 sm:grid-cols-2">
          {products.map((p) => {
            const stock = p.variants.reduce((s, v) => s + v.stock, 0);
            return (
              <li key={p._id} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="h-20 w-20 flex-none rounded-lg object-cover" />
                ) : (
                  <div className="flex h-20 w-20 flex-none items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">No image</div>
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-medium text-gray-900">{p.name}</p>
                    <span className={`flex-none rounded-full px-2 py-0.5 text-xs ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">₹{(p.pricePaise / 100).toFixed(2)} · {p.category}</p>
                  <p className={`text-xs ${stock === 0 ? "text-red-600" : "text-gray-500"}`}>
                    {p.variants.map((v) => `${v.size}: ${v.stock}`).join(" · ")}
                  </p>
                  <div className="flex gap-3 pt-1 text-sm">
                    <button type="button" onClick={() => startEdit(p)} className="font-medium text-blue-600 hover:underline">Edit</button>
                    <button type="button" onClick={() => toggleActive(p)} className="font-medium text-gray-600 hover:underline">{p.isActive ? "Hide" : "Show"}</button>
                    <button type="button" onClick={() => handleDelete(p)} className="font-medium text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

const VendorProductsPage = () => {
  return (
    <main className="flex min-h-screen w-full justify-center bg-gray-50 px-4 py-8">
      <Suspense fallback={<p className="text-center text-gray-600">Loading...</p>}>
        <VendorProductsContent />
      </Suspense>
    </main>
  );
};

export default VendorProductsPage;