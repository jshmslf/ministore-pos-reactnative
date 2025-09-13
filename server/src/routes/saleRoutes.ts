import { Router } from "express";
import { createSale } from "../controllers/saleController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = Router();

router.post("/", authMiddleware, createSale);

export default router;