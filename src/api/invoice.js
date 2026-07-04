import axios from "axios";

const API = axios.create({
    baseURL: "https://wholesome-vitality-production-139c.up.railway.app/api"
});

export const getInvoice = (id) =>
    API.get(`/invoice/${id}`);