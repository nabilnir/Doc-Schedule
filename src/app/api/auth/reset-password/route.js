import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
    try {
        const { email, otp, newPassword } = await request.json();
        await connectDB();

        const user = await User.findOne({
            email: email.toLowerCase(),
            resetOtp: otp,
            resetOtpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 400 });
        }

        // 1. Update Password (Mongoose pre-save hook will hash it)
        user.password = newPassword;

        // 2. Clear reset fields
        user.resetOtp = null;
        user.resetOtpExpires = null;

        await user.save();

        return NextResponse.json({ message: "Password reset successful" }, { status: 200 });

    } catch (err) {
        console.error("Reset Password Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
