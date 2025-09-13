import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    contact?: string;
    balance: number;
    transactions: mongoose.Types.ObjectId[];
}

const CustomerSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        name: { type: String, required: true },
        contact: { type: String },
        balance: { type: Number, default: 0 },
        transactions: [{ type: Schema.Types.ObjectId, ref: "Sale" }],
    },
    { timestamps: true }
);

export default mongoose.model<ICustomer>("Customer", CustomerSchema);