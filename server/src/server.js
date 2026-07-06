import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import emailRoutes from "./routes/email.routes.js";
import creditRoutes from "./routes/credit.routes.js";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes("vercel.app") ||
        origin === "http://localhost:5173"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/credit-notes", creditRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Factory Stock Platform Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});