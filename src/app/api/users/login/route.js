import Connection from '@/database/config';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

Connection();

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response("Email and Password are required", { status: 401 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return new Response("Email does not exist", { status: 400 });
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return new Response("Incorrect Password", { status: 400 });
        }

        const tokenData = {
            email: user.email,  
            id: user._id
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY, { expiresIn: '1d' });

        const response = NextResponse.json({ message: "Login successful" });
        response.cookies.set("token", token, { httpOnly: true });

        return response;
    } catch (error) {
        console.error("Error:", error.message);
        return new Response("Something went wrong", { status: 500 });
    }
};
