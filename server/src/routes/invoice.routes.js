import express from "express";

import {

    getInvoice

} from "../controllers/invoice.controller.js";

const router = express.Router();

router.get("/:id", getInvoice);

export default router;