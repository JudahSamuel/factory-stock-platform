import axios from "axios";

const API = axios.create({

    baseURL: "http://localhost:5000/api"

});

// Automatically attach token
API.interceptors.request.use((config) => {

    const adminToken = localStorage.getItem("adminToken");
    const merchantToken = localStorage.getItem("token");

    if (adminToken) {

        config.headers.Authorization = `Bearer ${adminToken}`;

    }

    else if (merchantToken) {

        config.headers.Authorization = `Bearer ${merchantToken}`;

    }

    return config;

});

// Handle Unauthorized
API.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            localStorage.clear();

            window.location.href = "/";

        }

        return Promise.reject(error);

    }

);

export const getProducts = () =>
    API.get("/products");

export const uploadProducts = (products) =>
    API.post("/products/upload", {
        products
    });