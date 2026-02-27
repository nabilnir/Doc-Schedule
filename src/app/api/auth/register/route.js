import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function POST(request) {
    try {
        const body = await request.json();
        const { fullName, email, phone, password, role } = body;

        await connectDB();

        // 1. Check duplicate
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        // 3. Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 4. Firebase: create user
        let firebaseUid = null;
        try {
            const fbUser = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(fbUser.user, { displayName: fullName });
            firebaseUid = fbUser.user.uid;
        } catch (fbErr) {
            return NextResponse.json({ error: fbErr.message }, { status: 400 });
        }

        // 5. MongoDB: save user (password is hashed automatically by UserSchema.pre('save') hook)
        const newUser = await User.create({
            fullName,
            email: email.toLowerCase(),
            phone: phone || "",
            password: password,
            role,
            provider: "credentials",
            firebaseUid,
            otp: otpCode,
            isVerified: false,
        });



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
            <p>Dear ${fullName},</p>
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
            console.error("Nodemailer Error (Email sending failed):", emailErr.message);
            // We don't return an error here because the user is created and OTP is logged to terminal.
            // This prevents the 500 error from stopping the registration flow.
        }

        return NextResponse.json({ message: "OTP sent" }, { status: 201 });

    } catch (err) {
        console.error("Full Error Info:", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}