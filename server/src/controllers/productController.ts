import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.ts";
import Product from "../models/Product.ts";

export const getProducts = async (req: AuthRequest, res: Response) => {
    try {
        const products = await Product.find({
            $or: [{ user: req.user._id }, { user: { $exists: false } }],
        });
        res.json(products);
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const addProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { name, category, srp, sellingPrice, stock } = req.body;

        const product = new Product({
            user: req.user._id, // ✅ always defined
            name,
            category,
            srp,
            sellingPrice,
            stock,
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error("Add product error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id }, // ✅ scoped to user
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json(product);
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product Deleted" });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
