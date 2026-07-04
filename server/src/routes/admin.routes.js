import express from "express";

import {
    getPendingMerchants,
    approveMerchant,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    updateDelivery
} from "../controllers/admin.controller.js";

import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all admin routes
router.use(verifyAdmin);

// Orders
router.get("/orders", getAllOrders);

router.put("/orders/:id/status", updateOrderStatus);

router.put("/orders/:id/payment", updatePaymentStatus);

router.put("/orders/:id/delivery", updateDelivery);

// Merchant Approval
router.get("/merchants", getPendingMerchants);

router.put("/merchants/:id/approve", approveMerchant);

export default router;