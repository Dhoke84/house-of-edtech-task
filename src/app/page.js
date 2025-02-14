"use client";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white p-6 text-center">
      <div className="max-w-3xl">
        <h1 className="text-6xl font-extrabold mb-6 drop-shadow-lg">Welcome to Our User Manager</h1>
        <p className="text-2xl mb-10 drop-shadow-md">
          Effortlessly organize, track, and manage user data with ease.
        </p>
        
        {/* Buttons */}
        <div className="flex justify-center space-x-6">
          <a href="/login">
            <button className="px-10 py-4 bg-white text-indigo-600 text-xl font-semibold rounded-2xl shadow-xl hover:bg-gray-200 transition">
              Login
            </button>
          </a>
          <a href="/register">
            <button className="px-10 py-4 bg-black text-white text-xl font-semibold rounded-2xl shadow-xl hover:bg-gray-800 transition">
              Register
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
