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

// =======================================
// CORS Configuration
// =======================================

const allowedOrigins = [
    "http://localhost:5173",
    "https://www.lasyaenterprises.in",
    "https://lasyaenterprises.in"
];

app.use(
    cors({
        origin: (origin, callback) => {

            // Allow Postman, mobile apps, server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("Blocked Origin:", origin);

            return callback(new Error("Not allowed by CORS"));

        },
        credentials: true
    })
);

app.use(express.json());

// =======================================
// Routes
// =======================================

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/credit-notes", creditRoutes);

// =======================================
// Health Check
// =======================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Factory Stock Platform Backend Running 🚀"
    });

});

// =======================================
// Start Server
// =======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});