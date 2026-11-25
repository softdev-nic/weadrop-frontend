import React from "react";
import "../utilities/animations/titleTextAnimation.css";

// A parcel stands in for the "o" in WeaDrop, and a delivery truck drives below.
const Title = ({ tagline = "Order today. Delivered to your door." }) => {
  return (
    <header className="mx-auto max-w-6xl py-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
        <span className="sr-only">WeaDrop</span>
        <span aria-hidden="true" className="inline-flex items-baseline">
          <span className="text-gray-900">Wea</span>
          <span className="title-accent">Dr</span>
          <svg viewBox="0 0 32 32" className="title-parcel">
            <rect x="1" y="3" width="30" height="28" rx="3" fill="#f59e0b" />
            <path d="M1 12V6a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v6z" fill="#d97706" />
            <path d="M12 3h8v14l-4-3-4 3z" fill="#fef3c7" />
            <path d="M20 26h7" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="title-accent">p</span>
        </span>
      </h1>

      <div aria-hidden="true" className="title-road">
        <svg viewBox="0 0 64 36" className="title-truck">
          <rect x="1" y="3" width="38" height="24" rx="3" fill="#2563eb" />
          <path d="M41 10h11l10 9v8H41z" fill="#f59e0b" />
          <path d="M45 13h6l6 6H45z" fill="#fef3c7" />
          <circle cx="13" cy="29" r="6" fill="#374151" />
          <circle cx="13" cy="29" r="2.5" fill="#e5e7eb" />
          <circle cx="50" cy="29" r="6" fill="#374151" />
          <circle cx="50" cy="29" r="2.5" fill="#e5e7eb" />
        </svg>
      </div>

      {tagline && <p className="mt-4 text-base text-gray-600 sm:text-lg">{tagline}</p>}
    </header>
  );
};

export default Title;
