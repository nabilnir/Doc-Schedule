import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    // (sort by createdAt)
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(10);
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}