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

        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "This Year";

        await connectDB();

        const now = new Date();
        const currentYear = now.getFullYear();
        const targetYear = period === "Last Year" ? currentYear - 1 : currentYear;

        // Initialize display arrays
        let monthlyRevenue = [];
        let monthNames = [];

        if (period === "Today") {
            // Split day into 24 hours
            monthlyRevenue = Array(24).fill(0);
            monthNames = Array.from({length: 24}, (_, i) => `${i}:00`);

            const startOfDay = new Date(now.setHours(0,0,0,0));
            const endOfDay = new Date(now.setHours(23,59,59,999));

            const appointments = await Appointment.find({
                status: { $in: ["confirmed", "completed"] },
                appointmentDate: { $gte: startOfDay, $lte: endOfDay }
            }).populate("doctorId", "fee");

            for (const app of appointments) {
                if (app.doctorId?.fee) {
                    const hour = new Date(app.appointmentDate).getHours();
                    monthlyRevenue[hour] += app.doctorId.fee;
                }
            }
        } else if (period === "This Month") {
            // Split current month into 4 weeks
            monthlyRevenue = Array(4).fill(0);
            monthNames = ["Week 1", "Week 2", "Week 3", "Week 4"];

            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const appointments = await Appointment.find({
                status: { $in: ["confirmed", "completed"] },
                appointmentDate: { $gte: startOfMonth, $lte: endOfMonth }
            }).populate("doctorId", "fee");

            for (const app of appointments) {
                if (app.doctorId?.fee) {
                    const day = new Date(app.appointmentDate).getDate();
                    const week = Math.min(Math.floor((day - 1) / 7), 3);
                    monthlyRevenue[week] += app.doctorId.fee;
                }
            }
        } else {
            // Standard 12-month year split
            monthlyRevenue = Array(12).fill(0);
            monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            const appointments = await Appointment.find({
                status: { $in: ["confirmed", "completed"] },
                appointmentDate: {
                    $gte: new Date(targetYear, 0, 1),
                    $lte: new Date(targetYear, 11, 31)
                }
            }).populate("doctorId", "fee");

            for (const app of appointments) {
                if (app.doctorId?.fee) {
                    const month = new Date(app.appointmentDate).getMonth();
                    monthlyRevenue[month] += app.doctorId.fee;
                }
            }
        }

        const maxRevenue = Math.max(...monthlyRevenue, 5000); // Scale with 5k min (Better for low ranges)

        return NextResponse.json({
            monthlyRevenue,
            monthNames,
            maxRevenue,
            totalRevenue: monthlyRevenue.reduce((a, b) => a + b, 0),
            targetYear
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching revenue data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
