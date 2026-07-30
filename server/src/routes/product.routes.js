import express from "express";

import {
    getProducts,
    uploadProducts,
    addProduct,
    updateStock
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/", addProduct);

router.post("/upload", uploadProducts);

router.patch("/:id/stock", updateStock);

export default router;