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

        if (user.isBlocked) {
            return NextResponse.json({ error: "Account blocked. Please contact admin." }, { status: 403 });
        }

        // Compare OTP
        if (user.otp !== otp) {
            const updated = await User.findOneAndUpdate(
                { email: email.toLowerCase() },
                { $inc: { otpAttempts: 1 } },
                { new: true, upsert: false }
            );

            const attemptsUsed = updated.otpAttempts || 0;
            const remaining = Math.max(0, 5 - attemptsUsed);

            if (attemptsUsed >= 5) {
                await User.updateOne({ _id: updated._id }, { $set: { isBlocked: true } });
                return NextResponse.json({
                    error: "Too many failed attempts. Account blocked. Please contact admin."
                }, { status: 403 });
            }

            return NextResponse.json({
                error: `Invalid OTP code. ${remaining} attempts remaining.`
            }, { status: 400 });
        }

        // Use findOneAndUpdate to BYPASS the pre-save hook (password is never re-hashed)
        await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { $set: { isVerified: true, otp: null, otpAttempts: 0 } }
        );

        return NextResponse.json({ message: "Verified" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}