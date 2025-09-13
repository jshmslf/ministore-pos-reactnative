import mongoose, { Document, Schema } from "mongoose";

export interface ISale extends Document {
    user: mongoose.Types.ObjectId;
    customer?: mongoose.Types.ObjectId;
    items: {
        product: mongoose.Types.ObjectId;
        quantity: number;
        sellingPrice: number;
    }[];
    total: number;
    paidAmount: number;
    createdAt: Date;
}

const SaleSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        customer: { type: Schema.Types.ObjectId, ref: "Customer" },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
                sellingPrice: { type: Number, required: true },
            },
        ],
        total: { type: Number, required: true },
        paidAmoun: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export default mongoose.model<ISale>("Sale", SaleSchema);