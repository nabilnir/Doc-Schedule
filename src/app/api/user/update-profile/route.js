import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        console.log("--- Update Profile Debug ---");
        console.log("Session User:", session?.user);

        if (!session || !session.user?.email) {
            console.log("Error: Unauthorized session");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        console.log("Incoming Payload:", body);
        const { fullName, email, phone, image } = body;

        await connectDB();

        // Find the user by current session email
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            console.log("Error: User not found for email:", session.user.email);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log("User found in DB:", user._id);

        // Check if new email is already taken by another user
        if (email && email.toLowerCase() !== user.email) {
            console.log("Attempting email change to:", email.toLowerCase());
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                console.log("Error: Email already in use by another user");
                return NextResponse.json({ error: "Email already in use" }, { status: 400 });
            }
            user.email = email.toLowerCase();
        }

        if (fullName) {
            console.log("Updating FullName to:", fullName);
            user.fullName = fullName;
        }
        if (phone) {
            console.log("Updating Phone to:", phone);
            user.phone = phone;
        }
        if (image !== undefined) {
            console.log("Updating Image URL");
            user.image = image;
        }

        const savedUser = await user.save();
        console.log("User saved successfully:", savedUser._id);
        console.log("----------------------------");

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                image: user.image
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
