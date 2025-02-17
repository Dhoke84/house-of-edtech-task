import { NextResponse } from "next/server";
import Connection from "@/database/config";
import Contact from "@/models/contact";

Connection(); // Ensure Database Connection

export async function handler(req) {
    try {
        if (req.method === "POST") {
            // Create a Contact
            const body = await req.json();
            const { name, contact, email, address } = body;

            if (!name || !contact || !email || !address) {
                return NextResponse.json({ error: "All fields are required" }, { status: 400 });
            }

            const newContact = new Contact({ name, contact, email, address });
            await newContact.save();

            return NextResponse.json(
                { message: "Contact Created Successfully", contact: newContact },
                { status: 201 }
            );
        } 
        
        else if (req.method === "GET") {
            // Get All Contacts
            const contacts = await Contact.find();
            return NextResponse.json({ contacts }, { status: 200 });
        } 
        
        else if (req.method === "PUT") {
            // Update Contact
            const body = await req.json();
            const { id, name, contact, email, address } = body;

            if (!id) {
                return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
            }

            const updatedContact = await Contact.findByIdAndUpdate(
                id,
                { name, contact, email, address },
                { new: true }
            );

            if (!updatedContact) {
                return NextResponse.json({ error: "Contact not found" }, { status: 404 });
            }

            return NextResponse.json(
                { message: "Contact Updated Successfully", contact: updatedContact },
                { status: 200 }
            );
        } 
        
        else if (req.method === "DELETE") {
            // Delete Contact
            const body = await req.json();
            const { id } = body;

            if (!id) {
                return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
            }

            const deletedContact = await Contact.findByIdAndDelete(id);
            if (!deletedContact) {
                return NextResponse.json({ error: "Contact not found" }, { status: 404 });
            }

            return NextResponse.json({ message: "Contact Deleted Successfully" }, { status: 200 });
        } 
        
        else {
            // Method Not Allowed
            return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
        }
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
