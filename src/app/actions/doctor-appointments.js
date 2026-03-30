"use server"

import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(appointmentId, newStatus) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "doctor") {
            return { success: false, error: "Unauthorized access. Only doctors can perform this action." };
        }

        await connectDB();

        // Security check: ensure the doctor updating this actually owns the appointment
        const doctor = await Doctor.findOne({
            $or: [{ userId: session.user.id }, { email: session.user.email }]
        }).lean();

        if (!doctor) {
            return { success: false, error: "Doctor profile not found." };
        }

        const appointment = await Appointment.findOne({ _id: appointmentId, doctorId: doctor._id });

        if (!appointment) {
            return { success: false, error: "Appointment not found or you do not have permission to modify it." };
        }

        appointment.status = newStatus;
        await appointment.save();

        // Refresh the appointments page cache to show the new status
        revalidatePath("/dashboard/doctor/appointments");

        return { success: true };
    } catch (error) {
        console.error("LOG: Error updating appointment status:", error);
        return { success: false, error: "Failed to update status." };
    }
}
