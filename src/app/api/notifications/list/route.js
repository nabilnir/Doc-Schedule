import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    await connectDB();

    // সরাসরি সেশন কল করুন (কনফিগ ছাড়া অনেক সময় ডিফল্ট সেশন পাওয়া যায়)
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // শুধুমাত্র লগইন করা ইউজারের নোটিফিকেশন খুঁজুন
    const notifications = await Notification.find({ 
      userEmail: session.user.email 
    })
    .sort({ createdAt: -1 })
    .limit(10);

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}