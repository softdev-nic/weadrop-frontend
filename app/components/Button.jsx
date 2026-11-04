function Button({ label }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}

export default Button;