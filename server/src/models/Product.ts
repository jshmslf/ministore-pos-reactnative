import mongoose, { Schema, type Document } from "mongoose";

export interface IProduct extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    catergory?: string;
    srp: number;
    sellingPrice: number;
    stock: number;
    createdAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        name: { type: String, required: true },
        category: { type: String },
        srp: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);