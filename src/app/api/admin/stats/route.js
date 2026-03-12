import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import Appointment from "@/models/Appointment";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Run queries concurrently
        const [patientsCount, doctorsCount, appointmentsCount] = await Promise.all([
            User.countDocuments({ role: "patient" }),
            Doctor.countDocuments({}),
            Appointment.countDocuments({}),
        ]);

        // Mock revenue or define some basic logic if fees were stored
        // Assuming $15 per appointment for placeholder logic
        const placeholderRevenueAmount = appointmentsCount * 15;

        // Optionally format revenue, but we can return raw numbers and format on frontend
        const stats = {
            totalPatients: patientsCount,
            totalDoctors: doctorsCount,
            totalAppointments: appointmentsCount,
            totalRevenue: placeholderRevenueAmount
        };

        return NextResponse.json(stats, { status: 200 });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
