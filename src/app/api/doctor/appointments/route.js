import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        // Session check: User login kora kina ebong se Doctor kina
        if (!session || session.user.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Doctor-er appointments khuje ber kora
        // Note: Apnar DB te 'doctorId' thakle sheta diye search kora best
        const appointments = await Appointment.find({ 
            doctorName: session.user.name // Ba doctorId: session.user.id
        }).sort({ createdAt: -1 }).lean();

        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}