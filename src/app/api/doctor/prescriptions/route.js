import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Prescription from "@/models/Prescription";
import Doctor from "@/models/Doctor";

// POST: Create/update a prescription for a patient
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { patientEmail, details, medicines } = body;

    if (!patientEmail || !details) {
      return NextResponse.json({ error: "Patient email and details are required." }, { status: 400 });
    }

    await connectDB();

    const doctor = await Doctor.findOne({
      $or: [{ userId: session.user.id }, { email: session.user.email }],
    }).lean();

    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    const prescription = await Prescription.create({
      patientEmail: patientEmail.toLowerCase(),
      doctorId: doctor._id,
      doctorName: doctor.name,
      details,
      medicines: medicines || [],
      date: new Date(),
      isActive: true,
    });

    return NextResponse.json({ success: true, prescriptionId: prescription._id.toString() });
  } catch (error) {
    console.error("Error saving prescription:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET: Fetch all prescriptions for a specific patient (by this doctor)
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const patientEmail = searchParams.get("patientEmail");

    if (!patientEmail) {
      return NextResponse.json({ error: "patientEmail is required." }, { status: 400 });
    }

    await connectDB();

    const doctor = await Doctor.findOne({
      $or: [{ userId: session.user.id }, { email: session.user.email }],
    }).lean();

    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    const prescriptions = await Prescription.find({
      doctorId: doctor._id,
      patientEmail: patientEmail.toLowerCase(),
    })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ prescriptions: JSON.parse(JSON.stringify(prescriptions)) });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
