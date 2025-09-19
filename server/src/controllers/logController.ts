import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.ts";
import Log from "../models/Log.ts";

export const getLogs = async (req: AuthRequest, res: Response) => {
    try {
        const logs = await Log.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Server error, ", error });
    }
};

export const addLog = async (req: AuthRequest, res: Response) => {
    try {
        const { action, details } = req.body;
        const log = new Log({
            user: req.user.id,
            action,
            details,
        });
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: "Server error, ", error });
    }
};