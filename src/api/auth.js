import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const loginMerchant = (data) =>
  API.post("/auth/login", data);

export const registerMerchant = (data) =>
  API.post("/auth/register", data);

export const loginAdmin = (data) =>
    API.post("/auth/admin/login", data);