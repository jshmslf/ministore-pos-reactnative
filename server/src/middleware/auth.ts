import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload | string;

        if (typeof decoded === "string" || !decoded.id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        req.user = { _id: (decoded as any).id };

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error });
    }
};
