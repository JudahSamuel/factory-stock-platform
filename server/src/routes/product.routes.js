import express from "express";

import {

    getProducts,

    uploadProducts

} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/upload", uploadProducts);

export default router;