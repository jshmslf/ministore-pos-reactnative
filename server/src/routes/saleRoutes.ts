import { Router } from "express";
import { createSale, getSales, getSalesToday } from "../controllers/saleController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = Router();

router.post("/", authMiddleware, createSale);
router.get("/", authMiddleware, getSales);
router.get("/today", authMiddleware, getSalesToday);

export default router;
