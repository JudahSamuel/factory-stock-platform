import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Automatically attach Admin Token
API.interceptors.request.use((config) => {

    const token = localStorage.getItem("adminToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

// If token becomes invalid
API.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");

            window.location.href = "/admin-login";

        }

        return Promise.reject(error);

    }

);

// =======================
// MERCHANTS
// =======================

// Approved merchants (Merchant Management page)
export const getMerchants = () =>
    API.get("/admin/merchants");

// Pending merchants (Approval page)
export const getPendingMerchants = () =>
    API.get("/admin/pending-merchants");

export const approveMerchant = (id) =>
    API.put(`/admin/merchants/${id}/approve`);

export const getMerchantDetails = (id) =>
    API.get(`/admin/merchants/${id}`);

// =======================
// ORDERS
// =======================

export const getAllOrders = () =>
    API.get("/admin/orders");

export const updateStatus = (
    id,
    status,
    discountPercent = 0
) =>
    API.put(`/admin/orders/${id}/status`, {
        status,
        discountPercent
    });

export const updatePayment = (
    id,
    paymentStatus
) =>
    API.put(`/admin/orders/${id}/payment`, {
        paymentStatus
    });

export const updateDelivery = (
    id,
    data
) =>
    API.put(
        `/admin/orders/${id}/delivery`,
        data
    );