 import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") return config;

    const userToken = localStorage.getItem("authorization");
    const orgToken = localStorage.getItem("access_token");

    if (userToken) config.headers["Authorization"] = userToken;
    if (orgToken) config.headers["access_token"] = orgToken;

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;