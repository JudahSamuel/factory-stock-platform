import axios from "axios";

console.log("API URL:", import.meta.env.VITE_API_URL);

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const sendInvoiceEmail = (id) =>
    API.post(`/email/invoice/${id}`);