import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const unreadCount = await Notification.countDocuments({ isRead: false });
    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}