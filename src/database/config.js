import mongoose from "mongoose";

const Connection = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Already connected to MongoDB");
            return;
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw new Error("Database connection failed");
    }
};

export default Connection;
