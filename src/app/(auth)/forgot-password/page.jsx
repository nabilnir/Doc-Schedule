"use strict";

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                // Redirect to reset password page after a short delay
                setTimeout(() => {
                    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
                }, 2000);
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to send reset code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-soft border border-white/20">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-black/5 rounded-2xl">
                        <KeyRound className="w-8 h-8 text-black" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Forgot Password?</h1>
                <p className="text-center text-muted-foreground mb-8">
                    Enter your email address and we'll send you a 6-digit code to reset your password.
                </p>

                {message && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm text-center">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-black transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-black text-white rounded-2xl font-semibold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Send Reset Code
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-black transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
