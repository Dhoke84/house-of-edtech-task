import Connection from "@/database/config";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        // Ensure database connection
        await Connection();

        // Parse request body
        const body = await req.json();
        console.log("Received body:", body);

        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Name, Email, and Password are required" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(12);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        console.log("User saved successfully");
        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error in register API:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};
