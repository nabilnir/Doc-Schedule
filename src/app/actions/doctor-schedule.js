"use server"

import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function updateDoctorSchedule(data) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "doctor") {
      return { success: false, error: "Unauthorized access." };
    }

    await connectDB();

    // Security check: Find doctor profile
    // We try to match by userId (from session) or email
    const doctor = await Doctor.findOne({
      $or: [
        { userId: session.user.id },
        { email: session.user.email }
      ]
    });

    if (!doctor) {
      return { success: false, error: "Doctor profile not found. Please complete your onboarding." };
    }

    // Update slots
    if (data.time_slots) {
      doctor.time_slots = data.time_slots;
    }

    if (data.blockedSlots) {
      doctor.blockedSlots = data.blockedSlots;
    }

    // If userId was not set but we found by email, link them now
    if (!doctor.userId && session.user.id) {
        doctor.userId = session.user.id;
    }

    await doctor.save();
    
    revalidatePath("/dashboard/doctor/schedule");
    return { success: true, message: "Schedule updated successfully!" };
  } catch (error) {
    console.error("LOG: Error updating schedule:", error);
    return { success: false, error: error.message || "Failed to update schedule." };
  }
}

export async function getDoctorSchedule() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "doctor") {
      throw new Error("Unauthorized");
    }

    await connectDB();

    const doctor = await Doctor.findOne({
      $or: [
        { userId: session.user.id },
        { email: session.user.email }
      ]
    }).lean();

    if (!doctor) {
      // Return empty defaults if no profile exists yet
      return { time_slots: [], blockedSlots: [] };
    }

    return {
      time_slots: doctor.time_slots || [],
      blockedSlots: JSON.parse(JSON.stringify(doctor.blockedSlots || []))
    };
  } catch (error) {
    console.error("LOG: Error fetching schedule:", error);
    return { time_slots: [], blockedSlots: [] };
  }
}

