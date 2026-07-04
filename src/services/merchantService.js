import axios from "axios";

const API = axios.create({

    baseURL: "https://wholesome-vitality-production-139c.up.railway.app/api"

});

export const registerMerchant = (data) =>

    API.post("/auth/register", data);

export const loginMerchant = (data) =>

    API.post("/auth/login", data);