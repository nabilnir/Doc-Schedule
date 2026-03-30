import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const patient = await Patient.findById(id).lean();

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}