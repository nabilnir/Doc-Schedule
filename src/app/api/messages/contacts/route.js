import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const { email, role } = session.user;
        let contacts = [];

        if (role === "patient") {
            // Find all unique doctors this patient has booked
            const appointments = await Appointment.find({ userEmail: email }).lean();
            const doctorIds = [...new Set(appointments.map(a => a.doctorId?.toString()).filter(Boolean))];

            const doctors = await Doctor.find({ _id: { $in: doctorIds } }).lean();
            contacts = doctors.map(d => ({
                name: d.name,
                email: d.email,
                image: d.image || "",
                specialty: d.specialty,
                role: "doctor",
            })).filter(c => c.email); // only those with an email

        } else if (role === "doctor") {
            // Find the doctor profile for this user
            const doctor = await Doctor.findOne({
                $or: [{ userId: session.user.id }, { email: email }]
            }).lean();
            if (doctor) {
                const appointments = await Appointment.find({ doctorId: doctor._id }).lean();
                // Get both the booking account email (userEmail) and the direct patient email (patientEmail)
                const patientEmails = [...new Set(appointments.flatMap(a => [a.userEmail, a.patientEmail]).filter(Boolean))];
                const patients = await User.find({ email: { $in: patientEmails } }).lean();
                contacts = patients.map(p => ({
                    name: p.fullName,
                    email: p.email,
                    image: p.image || "",
                    specialty: null,
                    role: "patient",
                }));
            }
        }

        return NextResponse.json({ contacts });
    } catch (error) {
        console.error("Messages contacts error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
