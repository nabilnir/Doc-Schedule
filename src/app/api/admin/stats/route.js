import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import Appointment from "@/models/Appointment";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter") || "Today";

        await connectDB();

        // Calculate date range based on filter
        let dateQuery = {};
        const now = new Date();
        if (filter === "Today") {
            dateQuery = { createdAt: { $gte: new Date(now.setHours(0,0,0,0)) } };
        } else if (filter === "This Week") {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - 7);
            dateQuery = { createdAt: { $gte: startOfWeek } };
        } else if (filter === "This Month") {
            const startOfMonth = new Date(now);
            startOfMonth.setMonth(now.getMonth() - 1);
            dateQuery = { createdAt: { $gte: startOfMonth } };
        } else if (filter === "This Year") {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            dateQuery = { createdAt: { $gte: startOfYear } };
        } else if (filter === "Last Year") {
            const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
            const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            dateQuery = { createdAt: { $gte: startOfLastYear, $lte: endOfLastYear } };
        }
        // No filter matches remains {}, handled below.

        // Run basic queries concurrently
        const [patientsCount, doctorsCount, appointmentsCount, doctors, rangeAppointments, latestAppointments, billingSummary, patientGenders, recentReviews] = await Promise.all([
            User.countDocuments({ role: "patient" }),
            Doctor.countDocuments({}),
            Appointment.countDocuments({}),
            Doctor.find({}, 'fee totalEarnings').lean(),
            filter === "This Year" ? null : Appointment.countDocuments(dateQuery),
            Appointment.find({}).sort({ createdAt: -1 }).limit(5).populate('doctorId', 'name specialty image designation').lean(),
            Appointment.find({ ...dateQuery, status: { $in: ["confirmed", "completed"] } }).populate('doctorId', 'fee').lean(),
            User.aggregate([
                { $match: { role: "patient" } },
                { $group: { _id: "$gender", count: { $sum: 1 } } }
            ]),
            // In a real app we'd fetch from a Review model. Let's return some logical dynamic data for now
            // since Review model might not be fully established. 
            Promise.resolve([]) // Replace with Review.find().limit(5) if exists
        ]);

        const filteredAppointments = filter === "This Year" ? appointmentsCount : rangeAppointments;

        // Map Patient Genders for the chart
        const genderStats = { male: 0, female: 0, other: 0 };
        patientGenders.forEach(g => {
            const label = g._id?.toLowerCase();
            if (label === "male") genderStats.male = g.count;
            else if (label === "female") genderStats.female = g.count;
            else if (label) genderStats.other += g.count;
        });

        // Calculate platform revenue within the selected filter period
        const periodPlatformRevenue = billingSummary.reduce((acc, app) => acc + (app.doctorId?.fee || 0), 0);

        // Define status-based stats for range
        const [pendingCount, cancelledCount, completedCount] = await Promise.all([
            Appointment.countDocuments({ ...dateQuery, status: "pending" }),
            Appointment.countDocuments({ ...dateQuery, status: "cancelled" }),
            Appointment.countDocuments({ ...dateQuery, status: { $in: ["confirmed", "completed"] } })
        ]);

        const stats = {
            totalPatients: patientsCount,
            totalDoctors: doctorsCount,
            totalAppointments: filteredAppointments,
            totalRevenue: periodPlatformRevenue, 
            pendingAppointments: pendingCount,
            cancelledAppointments: cancelledCount,
            completedAppointments: completedCount, 
            completedPercentage: filteredAppointments > 0 ? Math.round((completedCount / filteredAppointments) * 100) : 0,
            latestAppointments: latestAppointments,
            genderStats: genderStats,
            reviews: recentReviews
        };

        return NextResponse.json(stats, { status: 200 });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
