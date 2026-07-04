import axios from "axios";

const API=axios.create({

baseURL:"https://wholesome-vitality-production-139c.up.railway.app/api"

});

export const createOrder=(data)=>API.post("/orders",data);

export const getOrders=(id)=>API.get(`/orders/${id}`);