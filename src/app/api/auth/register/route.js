import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
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
        console.log("Registering user. Current Mongoose DB:", mongoose.connection.name);
        console.log("Connection Ready State:", mongoose.connection.readyState);
        if (mongoose.connection.name === 'test') {
            console.error("⛔ CRITICAL: Application is about to write to the 'test' database!");
        }

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
                subject: "Verification Code",
                html: `<p>Your OTP is: <b>${otpCode}</b></p>`
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