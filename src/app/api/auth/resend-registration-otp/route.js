import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(request) {
    try {
        const { email } = await request.json();
        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ error: "User is already verified" }, { status: 400 });
        }

        // 1. Generate New OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Save OTP - use findOneAndUpdate to bypass pre-save hook (password never touched)
        await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { $set: { otp: otpCode } }
        );

        // 3. Log to terminal (Fallback for dev)
        console.log("-----------------------------------------");
        console.log(`RESENT REGISTRATION OTP FOR ${email}: ${otpCode}`);
        console.log("-----------------------------------------");

        // 4. Send Email
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: `"DocSchedule" <${process.env.EMAIL_USER}>`,
                to: email.toLowerCase(),
                subject: "Your New Verification Code",
                html: `<p>Your new verification code is: <b>${otpCode}</b></p>`
            });
        } catch (emailErr) {
            console.error("Nodemailer Error (Resend Registration):", emailErr.message);
        }

        return NextResponse.json({ message: "OTP resent successfully" }, { status: 200 });

    } catch (err) {
        console.error("Resend OTP Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
