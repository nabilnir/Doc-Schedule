import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        // ১. Appointment Save Kora
        const newAppointment = await Appointment.create(body);
        console.log("Appointment Created:", newAppointment._id);

        // ২. Patient Record Logic (Phone number ke unique dhorchi)
        const patientData = {
            name: body.patientName,
            age: body.patientAge,
            gender: body.patientGender,
            phone: body.patientPhone || body.phone,
            email: body.patientEmail || body.userEmail,
            doctorId: body.doctorId,
            lastVisit: new Date(),
        };

        // Jodi patient age theke thake tobe update hobe, na thakle create hobe (Upsert)
        const updatedPatient = await Patient.findOneAndUpdate(
            { phone: patientData.phone }, // Find by phone
            { 
                $set: patientData, 
                $inc: { totalVisits: 1 } // Protibar booking e visit 1 barbe
            },
            { upsert: true, new: true } // Upsert mane na thakle create kora
        );

        console.log("Patient Record Updated/Created:", updatedPatient._id);

        return NextResponse.json({ 
            success: true, 
            message: "Booking & Patient record saved!" 
        });

    } catch (error) {
        console.error("Booking Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}