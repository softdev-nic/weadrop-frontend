 "use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getRequest } from "../utilities/httphelper";
import Menu from "../components/Menu";  
import menuItems from "../utilities/menuItems";
const toLabel = (key) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

const HIDDEN_KEYS = ["password", "token", "__v"];

const Dashboard = () => {
  const router = useRouter();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("authorization") || null;
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await getRequest("/user/data");
        setData(response);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("authorization");
          router.replace("/login");
          return;
        }
        setError(err.response?.data?.message || "Could not load your data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("authorization");
    router.replace("/login");
  };

  
  const user = data?.user ?? data?.data ?? data;
  const rows = user
    ? Object.entries(user).filter(
        ([key, value]) =>
          !HIDDEN_KEYS.includes(key) && (value === null || typeof value !== "object")
      )
    : [];

  return (
    <main className="min-h-screen w-full bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row">
        <aside className="w-full shrink-0 md:w-64">
          <Menu items={menuItems} />
        </aside>

        <div className="flex-1 space-y-6">
          <header className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h1 className="text-xl font-semibold text-black">Dashboard</h1>
            <button
              onClick={logout}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Log out
            </button>
          </header>

          {loading && <p className="text-sm text-gray-500">Loading your data…</p>}

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-black">Your details</h2>
              {rows.length === 0 ? (
                <p className="text-sm text-gray-500">No details to show yet.</p>
              ) : (
                <dl className="divide-y divide-gray-100">
                  {rows.map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 py-2.5">
                      <dt className="text-sm font-medium text-gray-700">{toLabel(key)}</dt>
                      <dd className="text-sm text-gray-900">{String(value ?? "-")}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;