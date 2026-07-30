import axios from "axios";

const API = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

});

export const registerMerchant = (data) =>

    API.post("/auth/register", data);

export const loginMerchant = (data) =>

    API.post("/auth/login", data);