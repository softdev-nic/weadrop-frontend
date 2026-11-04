"use client";

import Form from "../components/Form";
import { postRequest } from "../utilities/httphelper";



const fields =  [
  { id: "email", label: "Email", type: "email", name: "email", placeholder: "Enter your email", required: true },
  { id: "password", label: "Password", type: "password", name: "password", placeholder: "Enter your password", required: true },
];

const signIn = async(data,url)=>{
   try{
    const res = await postRequest(url, data);
    if(res?.token){
      localStorage.setItem("auth-token", res.token);

      return res;
    
   }
   }catch(err){
        throw err;
        
      }    
    }    

    const Login = () => {
  return (
    <main className="container flex min-h-screen w-full items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg">
        <h1 className="mb-6 text-center text-xl font-semibold text-black">
          Login
        </h1>
        <Form
          inputs={fields}
          url="/user/login"
          atSubmit={signIn}
          submitLabel="Login"
        />
      </section>
    </main>
  );
};

export default Login;   
