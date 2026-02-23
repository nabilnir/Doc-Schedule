import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Doctor from "@/models/Doctor";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            name, designation, education, specialty,
            experience, hospital, phone, fee, image, time_slots
        } = body;

        await connectDB();

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create or Update Doctor Profile
        const filter = { userId: user._id };
        const update = {
            name,
            designation,
            education,
            specialty,
            experience,
            hospital,
            phone,
            email: user.email,
            fee,
            image: image || user.image,
            time_slots: time_slots || [],
            userId: user._id
        };

        const doctor = await Doctor.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true,
            runValidators: true
        });

        // Update User role if it's not already doctor or admin
        if (user.role === "patient") {
            user.role = "doctor";
            await user.save();
        }

        return NextResponse.json({
            message: "Doctor profile saved successfully",
            doctor
        }, { status: 200 });

    } catch (error) {
        console.error("Doctor Onboarding Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
