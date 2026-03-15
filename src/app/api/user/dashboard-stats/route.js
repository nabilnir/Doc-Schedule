import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import Appointment from "@/models/Appointment";
import Prescription from "@/models/Prescription";
import MedicalReport from "@/models/MedicalReport";
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek } from "date-fns";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const role = (session.user.role || "patient").toLowerCase();
        const email = session.user.email.toLowerCase();

        const data = { role };

        if (role === "patient") {
            const [upcomingAppointment, prescriptionsCount, reportsCount, totalAppointments, userProfile] = await Promise.all([
                Appointment.findOne({ 
                    patientEmail: email, 
                    appointmentDate: { $gte: startOfDay(new Date()) },
                    status: { $ne: 'cancelled' }
                }).sort({ appointmentDate: 1 }).lean(),
                Prescription.countDocuments({ patientEmail: email, isActive: true }),
                MedicalReport.countDocuments({ patientEmail: email }),
                Appointment.countDocuments({ patientEmail: email }),
                User.findOne({ email }).select('age bloodGroup').lean()
            ]);

            data.stats = {
                upcomingAppointment,
                prescriptionsCount,
                reportsCount,
                totalAppointments,
                age: userProfile?.age || null,
                bloodGroup: userProfile?.bloodGroup || null
            };

            // Recent activity (last 5 appointments)
            data.recentActivity = await Appointment.find({ patientEmail: email })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

        } else if (role === "doctor") {
            const doctor = await Doctor.findOne({ email });
            if (!doctor) return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });

            const today = new Date();
            const startOfToday = startOfDay(today);
            const endOfToday = endOfDay(today);

            const [todayAppointments, totalConsultations, totalRevenue] = await Promise.all([
                Appointment.countDocuments({ 
                    doctorId: doctor._id, 
                    appointmentDate: { $gte: startOfToday, $lte: endOfToday }
                }),
                Appointment.countDocuments({ doctorId: doctor._id, status: 'confirmed' }),
                Appointment.aggregate([
                    { $match: { doctorId: doctor._id, status: 'confirmed' } },
                    { $group: { _id: null, total: { $sum: 1 } } } // Placeholder for actual fee logic if not in Doctor model
                ])
            ]);

            // Weekly volume for chart
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const date = subDays(today, i);
                last7Days.push({
                    name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    date: date
                });
            }

            const weeklyVolume = await Promise.all(last7Days.map(async (day) => {
                const count = await Appointment.countDocuments({
                    doctorId: doctor._id,
                    appointmentDate: { $gte: startOfDay(day.date), $lte: endOfDay(day.date) }
                });
                return { name: day.name, value: count };
            }));

            data.stats = {
                todayAppointments,
                totalConsultations,
                totalEarnings: doctor.totalEarnings || (totalConsultations * (doctor.fee || 0)),
                averageRating: 4.9, // Placeholder until Review model integrated
                weeklyVolume
            };

            data.upcomingAppointments = await Appointment.find({
                doctorId: doctor._id,
                appointmentDate: { $gte: startOfToday },
                status: 'pending'
            }).sort({ appointmentDate: 1 }).limit(5).lean();
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
