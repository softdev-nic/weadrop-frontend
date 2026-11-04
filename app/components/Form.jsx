 "use client";
import React from "react";
import Button from "./Button";


function Form({ inputs = [], submitLabel = "Submit", url, atSubmit }) {
  const [data, setData] = React.useState(() => {
    const initialData = {};
    inputs.forEach((input) => {
      initialData[input.name] = "";
    });
    return initialData;
  });
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
     const res =  await atSubmit(data, url);
      setSuccess(res?.message || "Submitted successfully");
      setData(Object.fromEntries(inputs.map((i) => [i.name, ""])))
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.log(err.message)
      setData(Object.fromEntries(inputs.map((i) => [i.name, ""])))
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-lg space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-4">
        {inputs.map((input) => (
          <div key={input.id} className="flex flex-col gap-1.5">
            <label htmlFor={input.id} className="text-sm font-medium text-gray-700">
              {input.label}
              {input.required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
            <input
              type={input.type}
              id={input.id}
              name={input.name}
              placeholder={input.placeholder}
              required={input.required}
              value={data[input.name] ?? ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        ))}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <Button label={submitLabel} />
      </div>
    </form>
  );
}

export default Form;