"use strict";

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2, CheckCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [resendMessage, setResendMessage] = useState('');

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.error || 'Reset failed');
            }
        } catch (err) {
            setError('Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    // Timer logic for resending OTP
    useEffect(() => {
        let timer;
        if (!success && resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [resendTimer, success]);

    const handleResendOTP = async () => {
        if (!canResend) return;

        setLoading(true);
        setError('');
        setResendMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setResendTimer(60);
                setCanResend(false);
                setResendMessage('New code sent to your terminal/email!');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to resend code');
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-soft border border-emerald-50 text-center animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-emerald-50 rounded-full">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-3 tracking-tight">Password Reset!</h1>
                <p className="text-muted-foreground mb-8">
                    Your password has been successfully updated. You will be redirected to the login page shortly.
                </p>
                <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-soft border border-white/20">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-black/5 rounded-2xl">
                    <ShieldCheck className="w-8 h-8 text-black" />
                </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Set New Password</h1>
            <p className="text-center text-muted-foreground mb-8">
                Enter the 6-digit code sent to <b>{email}</b> and your new password.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Reset Code</label>
                    <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder:text-slate-400 text-center text-2xl tracking-[0.5em] font-bold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">New Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-black transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-12 pl-12 pr-12 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Confirm New Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-black transition-colors" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-12 pl-12 pr-12 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-black text-white rounded-2xl font-semibold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Reset Password"
                    )}
                </button>

                {resendMessage && (
                    <p className="mt-4 text-emerald-600 text-[13px] font-medium text-center">
                        {resendMessage}
                    </p>
                )}

                <div className="mt-6 text-center border-t border-slate-50 pt-4">
                    <p className="text-slate-400 text-sm">
                        Didn&apos;t get code?{' '}
                        {canResend ? (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="text-black font-bold hover:underline"
                            >
                                Resend
                            </button>
                        ) : (
                            <span className="text-slate-300 font-medium whitespace-nowrap">Resend in {resendTimer}s</span>
                        )}
                    </p>
                </div>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
            <Suspense fallback={
                <div className="flex bg-white rounded-3xl p-12 shadow-soft items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-black" />
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
