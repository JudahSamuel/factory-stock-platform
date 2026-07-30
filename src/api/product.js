import axios from "axios";

const API = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

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

export const addProduct = (data) =>
    API.post("/products", data);

export const updateStock = (id, stock) =>
    API.patch(`/products/${id}/stock`, {
        stock
    });

export const updateProduct = (id, data) =>
    API.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
    API.delete(`/products/${id}`);

export const uploadProducts = (products) =>
    API.post("/products/upload", {
        products
    });