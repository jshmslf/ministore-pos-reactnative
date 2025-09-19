import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.ts";
import Customer from "../models/Customer.ts";

export const getCustomer = async (req: AuthRequest, res: Response) => {
    try {
        const customers = await Customer.find({ user: req.user.id }).populate("transactions");
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: "Server error, ", error })
    }
};

export const addCustomer = async (req: AuthRequest, res: Response) => {
    try {
        const { name, contact } = req.body;
        const customer = new Customer({
            user: req.user.id,
            name,
            contact,
            balance: 0,
        });
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Server error, ", error });
    }
};