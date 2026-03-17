import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();
    // Update all unread notifications as read
    await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}