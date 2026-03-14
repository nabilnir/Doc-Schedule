import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import User from "@/models/User";
import Appointment from "@/models/Appointment";

export const dynamic = 'force-dynamic';

// GET /api/admin/doctors — fetch all doctors with appointment stats
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();

        const doctors = await Doctor.find({}).sort({ createdAt: -1 });

        // Attach appointment stats for each doctor
        const enriched = await Promise.all(doctors.map(async (doc) => {
            const d = doc.toObject();
            const [completed, cancelled, total] = await Promise.all([
                Appointment.countDocuments({ doctorId: doc._id, status: "completed" }),
                Appointment.countDocuments({ doctorId: doc._id, status: "cancelled" }),
                Appointment.countDocuments({ doctorId: doc._id }),
            ]);
            const successRate = total > 0 ? Math.round((completed / total) * 100) : null;
            return { ...d, stats: { completed, cancelled, total, successRate } };
        }));

        return NextResponse.json(enriched);
    } catch (error) {
        console.error("Fetch doctors error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH /api/admin/doctors — approve/reject/suspend a doctor
export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();

        const { doctorId, action, specializations } = await req.json();
        if (!doctorId) return NextResponse.json({ error: "doctorId required" }, { status: 400 });

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

        if (action === "approve") {
            doctor.isVerified = true;
            doctor.verificationStatus = "approved";
            // Also update the user's role to 'doctor'
            await User.findOneAndUpdate({ _id: doctor.userId }, { role: "doctor" });
        } else if (action === "reject") {
            doctor.isVerified = false;
            doctor.verificationStatus = "rejected";
        } else if (action === "suspend") {
            doctor.isVerified = false;
            doctor.verificationStatus = "rejected";
            if (doctor.userId) {
                await User.findOneAndUpdate({ _id: doctor.userId }, { isBlocked: true });
            }
        } else if (action === "updateTags" && specializations) {
            doctor.specializations = specializations;
        } else if (action === "markPaid") {
            doctor.payoutStatus = "paid";
        } else if (action === "markPending") {
            doctor.payoutStatus = "pending";
        }

        await doctor.save();
        return NextResponse.json({ message: "Doctor updated", doctor });
    } catch (error) {
        console.error("Doctor update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT /api/admin/doctors — block/unblock time slots for a doctor
export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();

        const { doctorId, date, slots } = await req.json();
        if (!doctorId || !date) return NextResponse.json({ error: "doctorId and date required" }, { status: 400 });

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

        // Update or insert blocked slots for this date
        const existingIdx = doctor.blockedSlots.findIndex(b => b.date === date);
        if (existingIdx >= 0) {
            if (slots.length === 0) {
                doctor.blockedSlots.splice(existingIdx, 1); // Remove entry if no slots
            } else {
                doctor.blockedSlots[existingIdx].slots = slots;
            }
        } else if (slots.length > 0) {
            doctor.blockedSlots.push({ date, slots });
        }

        await doctor.save();
        return NextResponse.json({ message: "Slots updated", blockedSlots: doctor.blockedSlots });
    } catch (error) {
        console.error("Slot update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
