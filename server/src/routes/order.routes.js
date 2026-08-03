import express from "express";

import {
    createOrder,
    getOrders,
    getInvoice
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);

router.get("/invoice/:id", getInvoice);

router.get("/:id", getOrders);

export default router;