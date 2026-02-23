import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    // 1. Check Database Connection
    await connectDB();

    // 2. Parse the Request Body
    const body = await req.json();
    const { userId, planType } = body;

    // 3. Validate Data
    if (!userId || !planType) {
      return NextResponse.json({ success: false, error: "Missing Data" }, { status: 400 });
    }

    // 4. Update Mongoose
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { planType: planType, planStartDate: new Date() },
      { new: true } // returns the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    // Check your terminal/console for this output!
    console.error("API ROUTE ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}