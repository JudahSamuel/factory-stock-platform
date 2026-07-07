import express from "express";

import {

    getCreditNotes,

    getMerchantCreditNotes,

    markCreditPaid,

    createCreditNote

} from "../controllers/credit.controller.js";

const router = express.Router();

router.get("/", getCreditNotes);

router.get("/merchant/:id", getMerchantCreditNotes);

router.put("/:id/pay", markCreditPaid);

router.post("/create/:id", createCreditNote);

export default router;