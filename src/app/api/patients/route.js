import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB();
        
        // Search & Filter parameters (Jodi search bar thake)
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        
        const query = search 
            ? { name: { $regex: search, $options: "i" } } 
            : {};

        const patients = await Patient.find(query).sort({ lastVisit: -1 });
        
        return NextResponse.json(patients);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}