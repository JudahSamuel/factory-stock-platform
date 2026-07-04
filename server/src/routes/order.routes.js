import express from "express";

import{

createOrder,

getOrders

}from "../controllers/order.controller.js";

const router=express.Router();

router.post("/",createOrder);

router.get("/:id",getOrders);

export default router;