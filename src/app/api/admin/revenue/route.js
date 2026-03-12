import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Get current year
        const now = new Date();
        const currentYear = now.getFullYear();

        // Initialize monthly revenue array (12 months)
        const monthlyRevenue = Array(12).fill(0);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Fetch all confirmed appointments for current year
        const appointments = await Appointment.find({
            status: "confirmed",
            paymentStatus: "paid",
            appointmentDate: {
                $gte: new Date(currentYear, 0, 1),
                $lte: new Date(currentYear, 11, 31)
            }
        }).populate("doctorId", "fee");

        // Calculate revenue by month
        for (const appointment of appointments) {
            if (appointment.appointmentDate && appointment.doctorId?.fee) {
                const month = new Date(appointment.appointmentDate).getMonth();
                monthlyRevenue[month] += appointment.doctorId.fee;
            }
        }

        // Get max revenue for scaling
        const maxRevenue = Math.max(...monthlyRevenue, 50000); // Minimum scale of 50k

        return NextResponse.json({
            monthlyRevenue,
            monthNames,
            maxRevenue,
            totalRevenue: monthlyRevenue.reduce((a, b) => a + b, 0),
            currentYear
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching revenue data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
