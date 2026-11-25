"use client";

import React from "react";
import Link from "next/link";
import Card from "./Card";
import { getRequest } from "../utilities/httphelper";

const PAGE_SIZE = 12;

const linkClass =
  "inline-block rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

const toCardData = (product) => {
  const sizes = (product.variants || []).filter((v) => v.stock > 0).map((v) => v.size);
  return {
    title: product.name,
    description: product.description,
    image: product.images?.[0],
    imageAlt: product.name,
    fields: [
      { label: "Price", value: `₹${(product.pricePaise / 100).toFixed(2)}` },
      { label: "Sizes", value: sizes.length > 0 ? sizes.join(", ") : "Out of stock" },
      ...(product.vendor?.companyName ? [{ label: "Vendor", value: product.vendor.companyName }] : []),
    ],
  };
};

const fetchProducts = async (page) => {
  if (!localStorage.getItem("authorization")) return { needsLogin: true };
  try {
    const res = await getRequest(`/products?page=${page}&limit=${PAGE_SIZE}`);
    return { products: res.products || [], total: res.total || 0 };
  } catch (err) {
    if (err.response?.status === 401) return { needsLogin: true };
    return { error: err.response?.data?.error || "Could not load products." };
  }
};

const ProductList = () => {
  const [page, setPage] = React.useState(1);
  const [products, setProducts] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [status, setStatus] = React.useState("loading");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    fetchProducts(page).then((res) => {
      if (cancelled) return;
      if (res.needsLogin) return setStatus("login");
      if (res.error) {
        setError(res.error);
        return setStatus("error");
      }
      setProducts((prev) => {
        if (page === 1) return res.products;
        const seen = new Set(prev.map((p) => p._id));
        return [...prev, ...res.products.filter((p) => !seen.has(p._id))];
      });
      setTotal(res.total);
      setStatus("ready");
    });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const loadMore = () => {
    setStatus("loading");
    setPage(page + 1);
  };

  return (
    <section aria-label="Products" className="mx-auto mt-16 max-w-6xl space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Products</h2>

      {products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product._id} data={toCardData(product)}>
              <Link href="/orders/create-order" className={linkClass}>
                Order now
              </Link>
            </Card>
          ))}
        </div>
      )}

      {status === "loading" && <p className="text-sm text-gray-500">Loading products…</p>}
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      {status === "ready" && products.length === 0 && (
        <p className="text-sm text-gray-500">No products available yet.</p>
      )}
      {status === "login" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Log in to see products.</p>
          <Link href="/login" className={linkClass}>
            Log in
          </Link>
        </div>
      )}
      {status === "ready" && page * PAGE_SIZE < total && (
        <button type="button" onClick={loadMore} className={linkClass}>
          Load more
        </button>
      )}
    </section>
  );
};

export default ProductList;
