"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Lock,
  ChevronRight,
  Stethoscope,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { createUser } from "@/actions/register";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [role, setRole] = useState("patient");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);

    // ডাটা অবজেক্ট তৈরি
    const userData = { ...data, role };

    try {
      // সরাসরি সার্ভার অ্যাকশন কল করা হচ্ছে
      const result = await createUser(userData);

      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: result.message,
          icon: "success",
          confirmButtonColor: "#000000",
        }).then(() => {
          router.push("/login"); // লগইন পেজে রিডাইরেক্ট
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: result.message,
          icon: "error",
          confirmButtonColor: "#000000",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to connect to server.",
        icon: "error",
        confirmButtonColor: "#000000",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <div className="w-full max-w-[560px] bg-white rounded-[40px] shadow-2xl border border-[#E5E5E5] overflow-hidden">
        <div className="p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <Link href="/" className="mb-8">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">D</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-[#666666]">
              Join the future of healthcare scheduling.
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex gap-4 mb-10">
            <button
              type="button" // Prevent accidental form submission
              onClick={() => setRole("patient")}
              className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${role === "patient" ? "border-black bg-black text-white shadow-lg" : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"}`}
            >
              <UserCircle className="w-6 h-6" />
              <span className="text-sm font-bold">Patient</span>
            </button>
            <button
              type="button" // Prevent accidental form submission
              onClick={() => setRole("doctor")}
              className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${role === "doctor" ? "border-black bg-black text-white shadow-lg" : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"}`}
            >
              <Stethoscope className="w-6 h-6" />
              <span className="text-sm font-bold">Doctor</span>
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6"
          >
            <div className="col-span-2 space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-bold text-gray-400 uppercase ml-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#7BA1C7] focus:bg-white outline-none transition-all"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-gray-400 uppercase ml-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#7BA1C7] focus:bg-white outline-none transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-bold text-gray-400 uppercase ml-2"
              >
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value:
                        /^\+?\d{1,3}?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
                      message: "Invalid phone number format",
                    },
                  })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#7BA1C7] focus:bg-white outline-none transition-all"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-bold text-gray-400 uppercase ml-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-[#7BA1C7] focus:bg-white outline-none transition-all"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="col-span-2 mt-4">
              <button
                type="submit"
                disabled={isLoading} // ১. লোডিং এর সময় বাটন ডিসেবল থাকবে
                className={`w-full py-5 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl 
      ${isLoading ? "opacity-70 cursor-not-allowed" : ""} // ২. লোডিং এর সময় একটু ঝাপসা দেখাবে
    `}
              >
                {/* ৩. টেক্সট পরিবর্তন হবে */}
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    Register as {role === "patient" ? "Patient" : "Doctor"}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-[#666666]">
              Already have an account?{" "}
              <a href="/login" className="text-black font-bold hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
