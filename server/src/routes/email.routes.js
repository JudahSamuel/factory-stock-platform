import express from "express";

import {

    sendInvoiceEmail

} from "../controllers/email.controller.js";

const router = express.Router();

router.post(

    "/invoice/:id",

    sendInvoiceEmail

);

export default router;