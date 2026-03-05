import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import SystemLog from "@/models/SystemLog";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // --- Patient Engagement Metrics ---
        const [totalPatients, newSignupsToday, patientsWithAppointments] = await Promise.all([
            User.countDocuments({ role: "patient" }),
            User.countDocuments({ role: "patient", createdAt: { $gte: last24h } }),
            Appointment.distinct("patientEmail").then(emails => emails.length),
        ]);

        const activePatients = patientsWithAppointments;
        const inactivePatients = Math.max(0, totalPatients - activePatients);
        const engagementRate = totalPatients > 0
            ? Math.round((activePatients / totalPatients) * 100)
            : 0;

        // --- System Health Metrics ---
        const [bookingSuccess, bookingError, authErrors] = await Promise.all([
            SystemLog.countDocuments({ type: "booking", status: "success", createdAt: { $gte: last7d } }),
            SystemLog.countDocuments({ type: "booking", status: "error", createdAt: { $gte: last7d } }),
            SystemLog.countDocuments({ type: "auth", status: "error", createdAt: { $gte: last7d } }),
        ]);

        const totalBookingAttempts = bookingSuccess + bookingError;
        const bookingSuccessRate = totalBookingAttempts > 0
            ? Math.round((bookingSuccess / totalBookingAttempts) * 100)
            : 100; // No errors = 100% stable

        // Auth stability: if no errors, it's 100% stable
        const authStability = authErrors === 0 ? 100 : Math.max(0, 100 - authErrors * 5);

        return NextResponse.json({
            engagement: {
                totalPatients,
                newSignupsToday,
                activePatients,
                inactivePatients,
                engagementRate,
            },
            systemHealth: {
                bookingSuccessRate,
                bookingSuccess,
                bookingError,
                totalBookingAttempts,
                authStability,
                authErrors,
            }
        });

    } catch (error) {
        console.error("Analytics fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
