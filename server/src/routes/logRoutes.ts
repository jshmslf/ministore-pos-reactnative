import { Router } from "express";
import { addLog, getLogs } from "../controllers/logController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = Router();

router.get("/", authMiddleware, getLogs);
router.post("/", authMiddleware, addLog);

export default router;