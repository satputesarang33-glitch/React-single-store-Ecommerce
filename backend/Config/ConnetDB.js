import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Windows Node.js DNS resolution with MongoDB Atlas SRV URIs
try {
    dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);
} catch (err) {
    console.warn("Could not set custom DNS servers:", err.message);
}

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGODB;
        if (!mongoUri) {
            throw new Error("MongoDB URI is not defined in environment variables (.env)");
        }
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000
        });
        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        return null;
    }
};

export default connectDB;   