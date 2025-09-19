import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.ts";
import customerRoutes from "./routes/customerRoutes.ts";
import logRoutes from "./routes/logRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";
import saleRoutes from "./routes/saleRoutes.ts";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/logs", logRoutes);


mongoose
    .connect(process.env.MONGO_URI || "")
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch((error) => console.log(error))