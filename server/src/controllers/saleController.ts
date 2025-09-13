import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.ts";
import Customer from "../models/Customer.ts";
import Product from "../models/Product.ts";
import Sale from "../models/Sale.ts";

export const createSale = async (req: AuthRequest, res: Response) => {
    try {
        const { items, customerId, paidAmount } = req.body;

        let total = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ message: "Product not found" });

            total += item.sellingPrice * item.quantity;

            product.stock -= item.quantity;
            await product.save();
        }

        const sale = new Sale({
            user: req.user.id,
            customer: customerId,
            items,
            total,
            paidAmount,
        });
        await sale.save();

        if (customerId && paidAmount < total) {
            const customer = await Customer.findById(customerId);
            if (customer) {
                customer.balance += total - paidAmount;
                customer.transactions.push(sale.id);
                await customer.save();
            }
        }
        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ message: "Server error, ", error })
    }
};