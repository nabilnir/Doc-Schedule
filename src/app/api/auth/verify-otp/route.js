import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
    try {
        const { email, otp } = await request.json();
        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Compare OTP
        if (user.otp === otp) {
            user.isVerified = true;
            user.otp = null; // The OTP has been deleted for security reasons.
            await user.save();

            return NextResponse.json({ message: "Verified" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
        }
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}