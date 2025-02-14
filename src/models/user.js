import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
        collection: "users", // Explicit collection name
    }
);

// Prevents model re-registration error in Next.js hot reloading
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
