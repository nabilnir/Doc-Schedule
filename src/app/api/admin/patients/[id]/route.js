import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import Prescription from "@/models/Prescription";
import MedicalReport from "@/models/MedicalReport";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const patient = await User.findById(id).select("-password -otp -resetOtp");
        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        const email = patient.email;

        // Fetch related data
        const [appointments, prescriptions, reports] = await Promise.all([
            Appointment.find({ patientEmail: email }).sort({ appointmentDate: -1 }),
            Prescription.find({ patientEmail: email }).sort({ date: -1 }),
            MedicalReport.find({ patientEmail: email }).sort({ date: -1 })
        ]);

        return NextResponse.json({
            patient,
            stats: {
                totalAppointments: appointments.length,
                activePrescriptions: prescriptions.filter(p => p.isActive).length,
                totalReports: reports.length
            },
            history: {
                appointments,
                prescriptions,
                reports
            }
        });
    } catch (error) {
        console.error("Fetch patient details error:", error);
        return NextResponse.json({ error: "Failed to fetch patient details" }, { status: 500 });
    }
}
