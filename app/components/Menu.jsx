import React from "react";
import { useRouter } from "next/navigation";

const Menu = ({ items = [] }) => {
  const router = useRouter();

  const handleMenuClick = (item) => {
    if (item.label === "Logout") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authorization");
      }
      router.push("/login");
      return;
    }

    if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <nav className="h-full w-full rounded-xl border border-gray-200 bg-gray-100 p-4 shadow-sm">
      <ul className="flex h-full flex-col gap-2">
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => handleMenuClick(item)}
              className="w-full rounded-lg bg-white px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
