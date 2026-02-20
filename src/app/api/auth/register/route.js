import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import {
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function POST(request) {
    try {
        const body = await request.json();
        const { fullName, email, phone, password, role } = body;

        // ── Basic Validation ────────────────────────────────────────────────────
        if (!fullName || !email || !password || !role) {
            return NextResponse.json(
                { error: "Missing required fields: fullName, email, password, role" },
                { status: 400 }
            );
        }

        // ── MongoDB: check duplicate email ──────────────────────────────────────
        await connectDB();
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 409 }
            );
        }

        // ── Firebase: create user ───────────────────────────────────────────────
        let firebaseUid = null;
        try {
            const fbUser = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(fbUser.user, { displayName: fullName });
            firebaseUid = fbUser.user.uid;
        } catch (fbErr) {
            // Firebase errors (e.g. weak password, already-exists)
            return NextResponse.json(
                { error: fbErr.message },
                { status: 400 }
            );
        }

        // ── MongoDB: persist user ────────────────────────────────────────────────
        const newUser = await User.create({
            fullName,
            email: email.toLowerCase(),
            phone: phone || "",
            password,   // pre-save hook will hash this
            role,
            provider: "credentials",
            firebaseUid,
        });

        return NextResponse.json(
            {
                message: "Account created successfully.",
                user: {
                    id: newUser._id.toString(),
                    fullName: newUser.fullName,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Register error:", err);
        return NextResponse.json(
            { error: "Internal server error. Please try again." },
            { status: 500 }
        );
    }
}
