"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaGithub, FaLinkedin, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

const Dashboard = () => {
    const router = useRouter();
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", contact: "", email: "", address: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const contactsPerPage = 3;

    useEffect(() => {
        fetchContacts();
    }, []);

    

    const fetchContacts = async () => {
        try {
            const response = await axios.get("/api/contacts/crud");
            setContacts(Array.isArray(response.data.contacts) ? response.data.contacts : []);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            setContacts([]); // Prevent crashes
        }
    };

    const handleOpenModal = (contact = null) => {
        if (contact) {
            setFormData(contact);
            setIsEditing(true);
            setEditId(contact._id);
        } else {
            setFormData({ name: "", contact: "", email: "", address: "" });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: "", contact: "", email: "", address: "" });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.contact || !formData.email || !formData.address) {
            alert("All fields are required!");
            return;
        }
        try {
            if (isEditing) {
                await axios.put("/api/contacts/crud", { id: editId, ...formData });
            } else {
                await axios.post("/api/contacts/crud", formData);
            }
            setIsModalOpen(false);
            await fetchContacts();
        } catch (error) {
            console.error("Error saving contact:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;
        try {
            await axios.delete("/api/contacts/crud", { data: { id } });
            await fetchContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get('/api/users/logout');
            if (response.status === 200) {
                router.push('/login');
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Pagination Logic
    const totalPages = Math.ceil(contacts.length / contactsPerPage);
    const currentContacts = contacts.slice((currentPage - 1) * contactsPerPage, currentPage * contactsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
       <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white p-4 shadow-lg flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-blue-600 text-3xl">🎯</span>
                    <div>
                        <h1 className="text-blue-600 text-2xl font-bold">User Manager</h1>
                        <p className="text-gray-900 text-sm font-bold">House of Edutech</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto mt-2 md:mt-0">
                    <input
                        type="text"
                        placeholder="🔍 Search user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black w-full md:w-64"
                    />
                    <button onClick={() => handleOpenModal()} className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition w-full md:w-auto">
                        + Add User
                    </button>
                    <button 
    onClick={handleLogout} 
    className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition w-full md:w-auto"
>
    <FaSignOutAlt className="mr-2" /> Logout
</button>

                </div>
            </nav>

             {/* Contact List */}
             <div className="w-11/12 md:w-3/5 mx-auto mt-6">
                <h2 className="text-2xl font-semibold text-white mb-4 text-center">All Users</h2>
                {currentContacts.length === 0 ? (
                    <p className="text-white text-center">No users found.</p>
                ) : (
                    <ul className="bg-white shadow-md rounded-lg p-4 space-y-4">
                        {currentContacts.map((contact) => (
                            <li key={contact._id} className="border-b pb-4 last:border-none flex flex-col md:flex-row justify-between items-center">
                                <div className="text-center md:text-left">
                                    <p className="text-lg font-semibold text-black">{contact.name}</p>
                                    <p className="text-gray-600">{contact.contact} | {contact.email}</p>
                                    <p className="text-gray-500">{contact.address}</p>
                                </div>
                                <div className="flex space-x-2 mt-3 md:mt-0">
                                    <button onClick={() => handleOpenModal(contact)} className="bg-yellow-500 text-white py-2 px-3 rounded-full hover:bg-yellow-600 transition">Edit</button>
                                    <button onClick={() => handleDelete(contact._id)} className="bg-red-500 text-white py-2 px-3 rounded-full hover:bg-red-600 transition">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>


            {totalPages > 1 && (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 my-6">
        <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1} 
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2
                ${currentPage === 1 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 hover:shadow-xl"}`}
        >
            ⬅ Previous
        </button>

        <span className="text-md sm:text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg tracking-wider">
            Page {currentPage} of {totalPages}
        </span>

        <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages} 
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2
                ${currentPage === totalPages ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 hover:shadow-xl"}`}
        >
            Next ➡
        </button>
    </div>
)}



{isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-4">
        <div className="bg-white/90 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg mx-4 border border-gray-200 backdrop-blur-lg transform scale-95 transition-transform duration-300 ease-out">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4 sm:mb-6 text-center">
                {isEditing ? "Edit User" : "Add User"}
            </h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} 
                    className="w-full p-3 mb-3 border border-gray-300 rounded-xl text-black bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                    required 
                />
                <input 
                    type="text" name="contact" placeholder="Contact No" value={formData.contact} onChange={handleChange} 
                    className="w-full p-3 mb-3 border border-gray-300 rounded-xl text-black bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                    required 
                />
                <input 
                    type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} 
                    className="w-full p-3 mb-3 border border-gray-300 rounded-xl text-black bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                    required 
                />
                <input 
                    type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} 
                    className="w-full p-3 mb-4 border border-gray-300 rounded-xl text-black bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                    required 
                />
                
                {/* Buttons */}
                <div className="flex flex-wrap justify-between gap-2">
                    <button 
                        type="button" onClick={handleCloseModal} 
                        className="bg-gray-500 text-black py-2 px-4 sm:px-5 rounded-full hover:bg-gray-600 transition-all shadow-lg w-full sm:w-auto"
                    >
                        Close
                    </button>
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white py-2 px-4 sm:px-5 rounded-full hover:bg-blue-600 transition-all shadow-lg w-full sm:w-auto"
                    >
                        {isEditing ? "Update User" : "Add User"}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}



           {/* Footer */}
           <footer className="bg-white p-4 flex flex-row flex-wrap justify-center items-center gap-4 md:gap-6 shadow-lg mt-auto">
    <span className="text-lg font-semibold text-black">Shreya Dhoke</span>
    <a href="https://github.com/Dhoke84" className="text-2xl text-black"><FaGithub /></a>
    <a href="https://www.linkedin.com/in/shreya-dhoke/" className="text-2xl text-black"><FaLinkedin /></a>
    <a href="mailto:shreyadhoke04@gmail.com" className="text-2xl text-black"><FaEnvelope /></a>
</footer>


        </div>
    );
};

export default Dashboard;
