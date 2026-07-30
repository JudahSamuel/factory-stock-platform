import express from "express";

import {
    getPendingMerchants,
    getAllMerchants,
    approveMerchant,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    updateDelivery,
    getMerchantDetails
} from "../controllers/admin.controller.js";

import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all admin routes
router.use(verifyAdmin);

/* ===========================
   Orders
=========================== */

router.get("/orders", getAllOrders);

router.put("/orders/:id/status", updateOrderStatus);

router.put("/orders/:id/payment", updatePaymentStatus);

router.put("/orders/:id/delivery", updateDelivery);

router.get("/merchants/:id", getMerchantDetails);

/* ===========================
   Merchants
=========================== */

// Approved merchants (Merchant Management page)
router.get("/merchants", getAllMerchants);

// Pending merchants (Approval page)
router.get("/pending-merchants", getPendingMerchants);

// Approve merchant
router.put("/merchants/:id/approve", approveMerchant);

export default router;