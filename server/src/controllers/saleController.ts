import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.ts";
import type { IProduct } from "../models/Product.ts";
import Product from "../models/Product.ts";
import Sale, { type ISaleItem } from "../models/Sale.ts"; // ✅ import ISaleItem

export const createSale = async (req: AuthRequest, res: Response) => {
    try {
        const { items, customerName } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items provided" });
        }

        let total = 0;
        const saleItems: ISaleItem[] = [];

        for (const item of items) {
            const product = await Product.findById(item.productId) as IProduct | null;

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }

            // Subtract stock
            product.stock -= item.quantity;
            await product.save();

            // Calculate price based on product.sellingPrice
            const lineTotal = item.quantity * product.sellingPrice;
            total += lineTotal;

            // Push sale item with product snapshot
            saleItems.push({
                product: product._id, // ✅ ObjectId is valid here
                name: product.name,
                quantity: item.quantity,
                price: product.sellingPrice,
            });
        }

        // Save sale with logged-in user
        const sale = new Sale({
            user: req.user._id, // ✅ no "possibly undefined"
            customerName: customerName || "Customer",
            items: saleItems,
            total,
        });

        await sale.save();
        res.status(201).json(sale);

    } catch (error) {
        console.error("Create sale error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getSales = async (req: AuthRequest, res: Response) => {
    try {
        const sales = await Sale.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(sales);
    } catch (error) {
        console.error("Get sales error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getSalesToday = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const sales = await Sale.find({
            user: req.user._id,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        const totalToday = sales.reduce((sum, sale) => sum + sale.total, 0);

        res.json({ totalToday });
    } catch (error) {
        console.error("Get sales today error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
