import mongoose, { Document, Schema } from "mongoose";

export interface ISaleItem {
    product: mongoose.Types.ObjectId; // reference
    name: string;                     // snapshot of product name
    quantity: number;
    price: number;                    // unit price at time of sale
}

export interface ISale extends Document {
    _id: mongoose.Types.ObjectId;      // ✅ add this
    user: mongoose.Types.ObjectId;
    customerName: string;
    items: ISaleItem[];
    total: number;
    createdAt: Date;
}

const SaleItemSchema = new Schema<ISaleItem>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const SaleSchema = new Schema<ISale>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        customerName: { type: String, default: "Customer" },
        items: [SaleItemSchema],
        total: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ISale>("Sale", SaleSchema);
