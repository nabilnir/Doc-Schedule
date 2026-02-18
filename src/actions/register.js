// actions/register.js
"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function createUser(data) {
  try {
    const { fullName, email, phone, password, role } = data;

    // ১. ডাটাবেস কানেকশন
    await connectMongoDB();

    // ২. ইউজার আগে থেকেই আছে কিনা চেক করা
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { 
        success: false, 
        message: "User with this email already exists." 
      };
    }

    // ৩. পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // ৪. নতুন ইউজার তৈরি করা
    await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    // ৫. সফল হলে রেস্পন্স পাঠানো
    return { 
      success: true, 
      message: "User registered successfully!" 
    };

  } catch (error) {
    console.error("Registration Error:", error);
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    };
  }
}