"use client";

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, ChevronRight, User, Loader2, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            redirect: false,
            email: form.email,
            password: form.password,
        });

        setLoading(false);

        if (result?.error === 'unverified') {
            setError('Your account is not verified. Please check your email for the OTP.');
        } else if (result?.error === 'blocked') {
            setError('Your account is blocked. Please contact the admin.');
        } else if (result?.error) {
            setError('Invalid email or password. Please try again.');
        } else {
            router.push('/dashboard');
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-b from-[#85A9D2] via-[#A8C4E5] to-[#F5F5F7] flex flex-col items-center justify-center pt-28 pb-8 px-4 relative">

            {/* Logo */}
            <div className="mb-4 flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg text-[#3CA9DB] font-bold text-lg">D</div>
                    <span className="text-2xl font-bold text-white tracking-tight">DocSchedule</span>
                </Link>
            </div>

            <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden">
                <div className="p-6 sm:p-8 pt-6">
                    <div className="flex flex-col items-center text-center mb-5">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-[#F5F5F7]">
                            <div className="w-full h-full rounded-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                                <User className="w-8 h-8 text-blue-200 mt-1" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mb-1 tracking-tight">Welcome to DocSchedule</h1>
                        <p className="text-[#666666] text-sm">Enter your credentials to continue.</p>
                    </div>

                    {/* Success notice from registration */}
                    {registered && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-medium">
                            Account created! Please sign in.
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-800 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="w-4 h-4" /></div>
                                <input name="email" type="email" placeholder="doctor@docschedule.com" value={form.email} onChange={handleChange} required
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] focus:ring-4 focus:ring-[#3CA9DB]/10 outline-none transition-all placeholder:text-gray-300 text-sm" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[13px] font-bold text-gray-800">Password</label>
                                <Link href="/forgot-password" title="Forgot Password" className="text-xs font-semibold text-[#3CA9DB] hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3CA9DB] transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] focus:ring-4 focus:ring-[#3CA9DB]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 bg-[#3CA9DB] text-white rounded-xl font-bold text-base hover:bg-[#3498C5] transition-all shadow-[0_8px_16px_rgba(60,169,219,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                            {loading ? 'Signing in...' : 'Continue'}
                        </button>
                    </form>

                    {/* Social Buttons Removed */}

                    <div className="mt-6 pt-5 border-t border-gray-100 text-center space-y-3">
                        <p className="text-[#666666] text-sm">
                            Don&apos;t have an account? <Link href="/register" className="text-[#3CA9DB] font-bold hover:underline">Sign up for free</Link>
                        </p>
                        <p className="text-[#666666]/50 text-xs">
                            Need help? <Link href="#" className="text-[#3CA9DB]/70 font-semibold hover:underline">Contact Us</Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-[#666666]/70 text-[13px] font-medium">© 2026 DocSchedule App</div>

            <div className="fixed bottom-6 right-6 w-14 h-14 bg-[#333] rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-[#85A9D2] via-[#A8C4E5] to-[#F5F5F7] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
