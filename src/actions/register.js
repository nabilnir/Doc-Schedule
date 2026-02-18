"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function createUser(data) {
  try {
    const { fullName, email, phone, password, role } = data;

    // 1. Connect to the database
    await connectMongoDB();

    // 2. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { 
        success: false, 
        message: "User with this email already exists." 
      };
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create a new user
    await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    // 5. Send success response
    return { 
      success: true, 
      message: "User registered successfully!" 
    };

  } catch (error) {
    console.error("Registration Error:", error);

    // Send error response if something goes wrong
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    };
  }
}
