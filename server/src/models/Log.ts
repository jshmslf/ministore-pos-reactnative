import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
    user: mongoose.Types.ObjectId;
    action: string;
    details: string;
    createdAt: Date;
}

const LogSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        action: { type: String, required: true },
        details: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<ILog>("Log", LogSchema);