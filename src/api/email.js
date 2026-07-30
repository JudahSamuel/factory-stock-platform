import axios from "axios";

const API = axios.create({

    baseURL: "http://localhost:5000/api"

});

export const sendInvoiceEmail = (id)=>

API.post(`/email/invoice/${id}`);