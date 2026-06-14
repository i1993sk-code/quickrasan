import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("❌ ERROR: MONGODB_URI is not defined in .env file!");
            process.exit(1);
        }

        console.log("⏳ Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected successfully!"); 
    } catch (error) {
        console.error("❌ MongoDB connection error details:", error.message);
        process.exit(1);
    }
}

export default connectDB;