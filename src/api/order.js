import axios from "axios";

const API=axios.create({

baseURL: import.meta.env.VITE_API_URL,

});

export const createOrder=(data)=>API.post("/orders",data);

export const getOrders=(id)=>API.get(`/orders/${id}`);

export const getInvoice = (id) =>
    API.get(`/orders/invoice/${id}`);