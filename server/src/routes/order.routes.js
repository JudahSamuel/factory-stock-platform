import express from "express";

import {
    createOrder,
    getOrders,
    getInvoice,
    deleteOrder
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);

router.get("/invoice/:id", getInvoice);

router.get("/:id", getOrders);

router.delete("/:id", deleteOrder);

export default router;