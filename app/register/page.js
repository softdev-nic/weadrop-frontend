"use client";

import Form from "../components/Form";
import { postRequest } from "../utilities/httphelper";

const fields =  [
  { id: "name", label: "Full Name", type: "text", name: "name", placeholder: "Enter your full name", required: true },
  { id: "email", label: "Email", type: "email", name: "email", placeholder: "Enter your email", required: true },
  { id: "mobile", label: "Mobile Number", type: "tel", name: "mobileNumber", placeholder: "Enter your mobile number", required: true },
  { id: "password", label: "Password", type: "password", name: "password", placeholder: "Enter your password", required: true },
  { id: "addressline1", label: "Address Line 1", type: "text", name: "addressLine1", placeholder: "Flat / house, street", required: true },
  { id: "addressline2", label: "Address Line 2", type: "text", name: "addressLine2", placeholder: "Landmark (optional)", required: false },
  { id: "city", label: "City", type: "text", name: "city", placeholder: "Enter your city", required: true },
  { id: "state", label: "State", type: "text", name: "state", placeholder: "Enter your state", required: true },
  { id: "postal", label: "Postal Code", type: "text", name: "postalCode", placeholder: "Enter your postal code", required: true },
];
const signUp = async(data,url)=>{
  return await postRequest(url, data)

}
 
export default function RegistrationPage() {

  return (
    <main className="container flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg">
        <h1 className="mb-6 text-center text-xl font-semibold text-black">
          Registration
        </h1>
        <Form
          inputs={fields}
          url="/user/register"
          atSubmit={signUp}
          submitLabel="Sign Up"
        />
      </section>
    </main>
  );
}