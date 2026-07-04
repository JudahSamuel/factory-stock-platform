import axios from "axios";

const API = axios.create({

    baseURL:"https://wholesome-vitality-production-139c.up.railway.app/api"

});

export const getAnalytics=()=>

API.get("/analytics");