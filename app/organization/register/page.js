 "use client";

import React from "react";
import Form from "../../components/Form";
import { postRequest } from "../../utilities/httphelper";

const fields = [
  { id: "name", label: "Company Name", type: "text", name: "companyName", placeholder: "Enter company name", required: true },
  { id: "email", label: "Company Email", type: "email", name: "email", placeholder: "Enter company email", required: true },
  { id: "password", label: "Password", type: "password", name: "password", placeholder: "Enter password", required: true },
  {
    id: "organizationType",
    label: "Organization Type",
    type: "select",
    name: "organizationType",
    required: true,
    options: [
      { label: "Select type", value: "" },
      { label: "Vendor", value: "Vendor" },
      { label: "Buyer", value: "Buyer" },
      { label: "Delivery Partner", value: "Delivery Partner" }, // must match the backend enum exactly
    ],
  },
  { id: "gst", label: "GST Number", type: "text", name: "gstNumber", placeholder: "15-character GST number", required: true },
  { id: "addressline1", label: "Address Line 1", type: "text", name: "addressLine1", placeholder: "Flat / house, street", required: true },
  { id: "addressline2", label: "Address Line 2", type: "text", name: "addressLine2", placeholder: "Landmark (optional)", required: false },
  { id: "city", label: "City", type: "text", name: "city", placeholder: "Enter city", required: true },
  { id: "state", label: "State", type: "text", name: "state", placeholder: "Enter state", required: true },
  { id: "postal", label: "Postal Code", type: "text", name: "postalCode", placeholder: "Enter postal code", required: true },
];

const registerOrganization = async (data, url) => {
  const res = await postRequest(url, data);
  window.location.href = "/dashboard";
  return res;
};

const OrgRegister = () => {
  return (
    <main className="container flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg">
        <h1 className="mb-6 text-center text-xl font-semibold text-black">Organization Registration</h1>
        <Form
          inputs={fields}
          url="/organization/register"
          atSubmit={registerOrganization}
          submitLabel="Register Organization"
        />
      </section>
    </main>
  );
};

export default OrgRegister;