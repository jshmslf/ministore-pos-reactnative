import { Router } from "express";
import { addCustomer, getCustomer } from "../controllers/customerController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = Router();

router.get("/", authMiddleware, getCustomer);
router.post("/", authMiddleware, addCustomer);

export default router;