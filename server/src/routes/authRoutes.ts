import { Router } from "express";
import { getMe, login, register, updateMe } from "../controllers/authController.ts";
import { authMiddleware } from "../middleware/auth.ts";
// import User from "../models/User.ts";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

// ✅ New route: get logged-in user
// router.get("/me", authMiddleware, async (req: any, res) => {
//     try {
//         const user = await User.findById(req.user.id).select("-passwordHash");
//         if (!user) return res.status(404).json({ message: "User not found" });
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: "Server error, ", error });
//     }
// });

export default router;
