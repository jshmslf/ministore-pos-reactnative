import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;       // ✅ add this
    firstName: string;
    middleName?: string;
    lastName: string;
    birthday?: Date;
    address?: string;
    email: string;
    passwordHash: string;
    storeName: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
        birthday: { type: Date },
        address: { type: String },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        storeName: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
