import axios from "axios";

const API = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

});

export const getCreditNotes = () =>
    API.get("/credit-notes");

export const getMerchantCreditNotes = (merchantId) =>
    API.get(`/credit-notes/merchant/${merchantId}`);

export const markPaid = (id) =>
    API.put(`/credit-notes/${id}/pay`);

export const createCreditNote = async (id) => {
    try {
        const res = await API.post(`/credit-notes/create/${id}`);
        return res;
    } catch (err) {
        console.log("API ERROR");
        console.log(err.response?.status);
        console.log(err.response?.data);
        throw err;
    }
};