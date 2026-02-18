"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  LogIn as LogInIcon,
} from "lucide-react";

// React Hook Form
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    setLoading(true);
    setSubmissionError("");

    console.log("Login Data Submitted:", data);

    // এখানে আপনার আসল লগইন API কল হবে
    // আমি একটি ডামি লগইন লজিক ব্যবহার করছি
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* লোগো এবং টাইটেল অংশ - কার্ডের বাইরে */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-600 p-3 rounded-full mb-3">
          <Stethoscope className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 text-center">
          DocSchedule
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 text-center">
          Healthcare appointment scheduling
        </p>
      </div>

      <Card className="w-full max-w-md p-4 shadow-lg rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-3 text-center text-gray-700 dark:text-gray-200">
            Sign In
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit(handleLogin)} className="grid gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-base font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`pl-9 h-10 text-base bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  {...register("email", {
                    required: "Email Address is required.",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email format.",
                    },
                  })}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-base font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-9 pr-10 h-10 text-base bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 6, // আপনার প্রয়োজন অনুযায়ী ন্যূনতম দৈর্ঘ্য সেট করুন
                      message: "Password must be at least 6 characters.",
                    },
                  })}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-1 dark:text-gray-400 dark:hover:bg-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {submissionError && (
              <div className="bg-red-100 text-red-700 text-sm font-medium p-3 rounded-md border border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800">
                {submissionError}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center text-base font-semibold transition-colors duration-200"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></span>
              ) : (
                <>
                  <LogInIcon className="h-4 w-4 mr-2" /> Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up" // আপনার রেজিস্ট্রেশন পেজের লিঙ্ক
              className="underline text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-500"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
