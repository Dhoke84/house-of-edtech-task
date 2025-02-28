"use client";
import Input from "../components/Input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const defaultData = { email: "", password: "" };

const Login = () => {
    const [data, setData] = useState(defaultData);
    const router = useRouter();
    
    const onValueChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onLogin = async (e) => {
        e.preventDefault();

        if (!data.email || !data.password) {
            alert("Please fill all mandatory parameters");
            return;
        }

        try {
            const response = await axios.post("/api/users/login", data);
            setData(defaultData);
            
            if (response.status === 200) {
                router.push("/profile");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
            <div className="bg-white shadow-2xl rounded-3xl px-14 pt-12 pb-14 mb-4 w-96 max-w-md transform transition-all hover:scale-105 duration-300">
                <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-900">Login</h1>
                <form className="space-y-6">
                <Input
    label="Email"
    id="email"
    type="email"
    value={data.email}
    onChange={onValueChange}
    className="border border-gray-400 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-4 focus:ring-indigo-300 text-black placeholder-gray-500"
/>

                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={onValueChange}
                        className="border border-gray-400 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-4 focus:ring-indigo-300 text-black placeholder-gray-500"
                    />
                    <button
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl w-full transition-transform transform hover:scale-105 shadow-lg"
                        onClick={(e) => onLogin(e)}
                    >
                        Sign In
                    </button>
                </form>
                <p className="text-center mt-8 text-gray-800 font-medium">
                    Don't have an account? {" "}
                    <Link href="/register" className="text-black-100 font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
