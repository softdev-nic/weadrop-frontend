"use client";

import React from "react";
import Link from "next/link";

const baseClass =
  "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-4";
const primaryClass = `${baseClass} bg-blue-600 text-white hover:bg-blue-700`;
const secondaryClass = `${baseClass} border border-gray-300 text-gray-700 hover:border-blue-600`;

// "storage" fires when another tab logs in or out
const subscribe = (onChange) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};
const getLoggedIn = () => Boolean(localStorage.getItem("authorization"));
const getServerLoggedIn = () => false;

const Navbar = () => {
  const loggedIn = React.useSyncExternalStore(subscribe, getLoggedIn, getServerLoggedIn);

  return (
    <nav aria-label="Main" className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 xl:px-0">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="text-gray-900">Wea</span>
          <span className="text-blue-600">Drop</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {loggedIn ? (
            <Link href="/dashboard" className={primaryClass}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={secondaryClass}>
                Log in
              </Link>
              <Link href="/register" className={primaryClass}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
