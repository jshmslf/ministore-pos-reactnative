import { Router } from "express";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../controllers/productController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = Router();

router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, addProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;