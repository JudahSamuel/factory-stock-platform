import express from "express";

import {
  registerMerchant,
  loginMerchant,
  loginAdmin
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerMerchant);

router.post("/login", loginMerchant);

router.post("/admin/login", loginAdmin);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working ✅",
  });
});

export default router;