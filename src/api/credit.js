import axios from "axios";

const API = axios.create({

    baseURL: "https://wholesome-vitality-production-139c.up.railway.app/api"

});

export const getCreditNotes = () =>
    API.get("/credit-notes");

export const getMerchantCreditNotes = (id) =>
    API.get(`/credit-notes/merchant/${id}`);

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