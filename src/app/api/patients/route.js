import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const filter = searchParams.get("filter") || "recent";

        // Base query: optionally filter by name search
        const query = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        // Gender filters
        if (filter === "male") query.gender = { $regex: /^male$/i };
        if (filter === "female") query.gender = { $regex: /^female$/i };

        // New patients: only 1 visit
        if (filter === "new") query.totalVisits = 1;

        // Sort logic
        let sort = {};
        switch (filter) {
            case "frequent":
                sort = { totalVisits: -1 };
                break;
            case "alphabetical":
                sort = { name: 1 };
                break;
            case "oldest":
                sort = { lastVisit: 1 };
                break;
            default: // recent, male, female, new
                sort = { lastVisit: -1 };
        }

        const patients = await Patient.find(query).sort(sort);

        return NextResponse.json(patients);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}