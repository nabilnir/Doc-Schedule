import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Appointment from "@/models/Appointment";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const order = searchParams.get("order") === "asc" ? 1 : -1;

        // Base query
        let query = { role: "patient" };

        // Search logic
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } }
            ];
        }

        // Fetch patients
        const patients = await User.find(query)
            .select("-password -otp -resetOtp -otpAttempts -loginAttempts")
            .sort({ [sortBy]: order });

        // Calculate last appointment date for each patient (simplified for now)
        // In a real app, we might want to aggregate this or store it on the user model for performance
        const patientsWithStats = await Promise.all(patients.map(async (patient) => {
            const lastAppointment = await Appointment.findOne({ patientEmail: patient.email })
                .sort({ appointmentDate: -1 })
                .select("appointmentDate");

            return {
                ...patient.toObject(),
                lastAppointmentDate: lastAppointment?.appointmentDate || null
            };
        }));

        return NextResponse.json(patientsWithStats);
    } catch (error) {
        console.error("Fetch patients error:", error);
        return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();
        const { id, isBlocked } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isBlocked },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: `Patient ${isBlocked ? 'suspended' : 'activated'} successfully`,
            user: updatedUser
        });
    } catch (error) {
        console.error("Update patient status error:", error);
        return NextResponse.json({ error: "Failed to update patient status" }, { status: 500 });
    }
}
