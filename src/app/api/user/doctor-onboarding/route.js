import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import { isValidImageUrl } from "@/lib/utils";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            name, designation, education, specialty,
            experience, hospital, phone, fee, image, time_slots,
            registrationNumber, credentialsUrl
        } = body;

        await connectDB();

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Validate image URL
        const validatedImage = isValidImageUrl(image) ? image : user.image;

        // Create or Update Doctor Profile (pending verification)
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
            image: validatedImage,
            time_slots: time_slots || [],
            userId: user._id,
            registrationNumber: registrationNumber || null,
            credentialsUrl: credentialsUrl || null,
            isVerified: false,
            verificationStatus: "pending",
        };

        const doctor = await Doctor.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true,
            runValidators: true
        });

        // NOTE: Role is NOT updated here. Doctor must be approved by admin first.
        // The admin's PATCH /api/admin/doctors?action=approve will set role to "doctor".

        return NextResponse.json({
            message: "Doctor profile submitted for review. You will be notified upon approval.",
            doctor
        }, { status: 200 });

    } catch (error) {
        console.error("Doctor Onboarding Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
