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