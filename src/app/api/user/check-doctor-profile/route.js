import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ hasProfile: false }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ hasProfile: false }, { status: 404 });
        }

        const doctor = await Doctor.findOne({ userId: user._id });

        return NextResponse.json({ hasProfile: !!doctor });

    } catch (error) {
        console.error("Check Doctor Profile Error:", error);
        return NextResponse.json({ hasProfile: false, error: "Internal Server Error" }, { status: 500 });
    }
}
