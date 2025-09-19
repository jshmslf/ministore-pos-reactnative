import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "mini-store",
        });
        console.log("MongoDB Connected");
    } catch (error: any) {
        console.error("MongoDB Connection Failed: ", error);
        process.exit(1);
    }
}

export default connectDB;