 "use client";

import React from "react";
import { useRouter } from "next/navigation";
import Form from "../../components/Form";
import { postRequest } from "@/app/utilities/httphelper";

const fields = [
  { id: "email", label: "Email", type: "email", name: "email", placeholder: "Enter your organization email", required: true },
  { id: "password", label: "Password", type: "password", name: "password", placeholder: "Enter your password", required: true },
];

const Org_Login = () => {
  const router = useRouter();

  React.useEffect(() => {
    if (!localStorage.getItem("authorization")) {
      router.replace("/login");
    }
  }, [router]);

  const signIn = async (data, url) => {
    const res = await postRequest(url, data);
    if (res?.access_token) {
      localStorage.setItem("access_token", res.access_token);
      router.push("/dashboard");
    }
    return res;
  };

  return (
    <main className="container flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg">
        <h1 className="mb-6 text-center text-xl font-semibold text-black">
          Organization login
        </h1>
        <Form
          inputs={fields}
          url="/organization/login"
          atSubmit={signIn}
          submitLabel="Login"
        />
      </section>
    </main>
  );
};

export default Org_Login;