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
            // We return 200 even if user not found for security (preventing email enumeration)
            // But for development/debugging, we might want to know.
            return NextResponse.json({ message: "If an account exists with this email, a reset code has been sent." }, { status: 200 });
        }

        // 1. Generate Reset OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // 2. Save to User
        user.resetOtp = otpCode;
        user.resetOtpExpires = expires;
        await user.save();

        // 3. Log to terminal (Fallback for dev)
        console.log("-----------------------------------------");
        console.log(`PASSWORD RESET OTP FOR ${email}: ${otpCode}`);
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
                subject: "Password Reset Code",
                html: `<p>Your password reset code is: <b>${otpCode}</b>. It expires in 10 minutes.</p>`
            });
        } catch (emailErr) {
            console.error("Nodemailer Error (Reset Password):", emailErr.message);
        }

        return NextResponse.json({ message: "Reset code sent" }, { status: 200 });

    } catch (err) {
        console.error("Forgot Password Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
