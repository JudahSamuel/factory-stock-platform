import axios from "axios";

const API=axios.create({

baseURL:"http://localhost:5000/api"

});

export const createOrder=(data)=>API.post("/orders",data);

export const getOrders=(id)=>API.get(`/orders/${id}`);