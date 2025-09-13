import { Router } from "express";
import jwt from "jsonwebtoken";
import { login, register } from "../controllers/authController.ts";
import User from "../models/User.ts";

const router = Router();

// middleware to check JWT
const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded; // { id: user._id }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token, ", err });
    }
};

router.post("/register", register);
router.post("/login", login);

// ✅ New route: get logged-in user
router.get("/me", authMiddleware, async (req: any, res) => {
    try {
        const user = await User.findById(req.user.id).select("-passwordHash");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error, ", error });
    }
});

export default router;
