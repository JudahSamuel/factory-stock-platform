import axios from "axios";

console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const loginMerchant = (data) =>
  API.post("/auth/login", data);

export const registerMerchant = (data) =>
  API.post("/auth/register", data);

export const loginAdmin = (data) =>
    API.post("/auth/admin/login", data);