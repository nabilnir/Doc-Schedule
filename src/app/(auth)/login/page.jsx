"use client";

import React, { useState } from "react";
import { Mail, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react"; // 1. Import NextAuth
import { useRouter } from "next/navigation"; // 2. Import Router
import Swal from "sweetalert2"; // 3. Import Alert

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false); // 4. Loading State
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 5. Login Function
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Calling NextAuth's signIn method
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Prevent page refresh or auto-redirect to handle manually
      });

      if (res.error) {
        // If login fails
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid email or password. Please try again.",
          confirmButtonColor: "#000000",
        });
      } else {
        // If login succeeds
        Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "Login successful.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.push("/"); // Redirect to home page or dashboard
          router.refresh(); // Refresh to update session
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] bg-white rounded-[40px] shadow-2xl border border-[#E5E5E5] overflow-hidden">
        <div className="p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <Link href="/" className="mb-8">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">D</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-[#666666]">
              Sign in to manage your healthcare connections.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-gray-400 uppercase ml-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="doctor@docschedule.com"
                  {...register("email", {
                    required: "Email address is required",
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
              <div className="flex justify-between items-center px-2">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-gray-400 uppercase"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-[#7BA1C7] hover:underline"
                >
                  Forgot?
                </a>
              </div>
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

            <button
              type="submit"
              disabled={isLoading} // Button will be disabled during loading
              className={`w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing In..." : "Sign In"}
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-[#666666]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register" // Better to use Link component instead of 'a' tag
                className="text-black font-bold hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
