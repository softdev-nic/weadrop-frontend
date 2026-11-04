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
