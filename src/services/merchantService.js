import axios from "axios";

const API = axios.create({

    baseURL: "http://localhost:5000/api"

});

export const registerMerchant = (data) =>

    API.post("/auth/register", data);

export const loginMerchant = (data) =>

    API.post("/auth/login", data);