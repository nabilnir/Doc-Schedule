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
                subject: "Verify Your DocSchedule Account",
                html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Account Verification</h2>
            <p>Dear User,</p>
            <p>We received a request to create a <strong>DocSchedule</strong> account using this email address: <span style="color: #3498db;">${email.toLowerCase()}</span>.</p>
            <p>Please use the following verification code to complete your registration:</p>
            
            <div style="background-color: #f4f7f6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">${otpCode}</span>
            </div>
            
            <p style="color: #e74c3c; font-size: 0.9em;"><strong>Note:</strong> For your security, do not forward or share this code with anyone.</p>
            <p>If you did not request this code, you can safely ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.85em; color: #7f8c8d;">
                Sincerely,<br>
                <strong>The DocSchedule Team</strong>
            </p>
        </div>
    `
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
