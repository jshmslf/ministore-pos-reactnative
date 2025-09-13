import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.ts";

export const register = async (req: Request, res: Response) => {
    const {
        firstName, middleName, lastName, email, password, birthday, address
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Reqiured fields missing" })
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            firstName,
            middleName,
            lastName,
            birthday,
            address,
            email,
            passwordHash: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

        res.status(201).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Server Error, ", error })
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and Password Requried" })
    try {

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Server error, ", error })
    }
};