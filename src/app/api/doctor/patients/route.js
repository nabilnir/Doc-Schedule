import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Prescription from "@/models/Prescription";
import Doctor from "@/models/Doctor";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    await connectDB();

    // Find the doctor profile by userId or email
    const doctor = await Doctor.findOne({
      $or: [{ userId: session.user.id }, { email: session.user.email }],
    }).lean();

    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    // Get all appointments for this doctor
    const appointments = await Appointment.find({ doctorId: doctor._id })
      .sort({ appointmentDate: -1 })
      .lean();

    // Build unique patient map (keyed by patientEmail)
    const patientMap = new Map();
    for (const app of appointments) {
      const email = app.patientEmail || app.userEmail;
      if (!email) continue;
      if (!patientMap.has(email)) {
        patientMap.set(email, {
          patientName: app.patientName,
          patientEmail: email,
          patientAge: app.patientAge,
          patientGender: app.patientGender,
          patientBloodGroup: app.patientBloodGroup,
          lastVisit: app.appointmentDate,
          totalVisits: 1,
          lastStatus: app.status,
        });
      } else {
        patientMap.get(email).totalVisits += 1;
      }
    }

    // Get latest prescription for each patient
    const patients = [];
    for (const [email, patientData] of patientMap.entries()) {
      // Apply search filter
      if (search && !patientData.patientName.toLowerCase().includes(search.toLowerCase()) &&
          !email.toLowerCase().includes(search.toLowerCase())) {
        continue;
      }

      const latestPrescription = await Prescription.findOne({
        doctorId: doctor._id,
        patientEmail: email,
      })
        .sort({ date: -1 })
        .lean();

      patients.push({
        ...patientData,
        hasPrescription: !!latestPrescription,
        prescriptionId: latestPrescription?._id?.toString() || null,
        prescriptionDate: latestPrescription?.date || null,
      });
    }

    return NextResponse.json({ patients, doctorId: doctor._id.toString() });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
