import axios from "axios";

const API = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

});

export const sendInvoiceEmail = (id)=>

API.post(`/email/invoice/${id}`);