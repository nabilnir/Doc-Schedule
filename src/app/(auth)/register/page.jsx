"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Phone, Mail, Lock, ChevronRight, Stethoscope, UserCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState('patient');
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(null); // 'google' | 'github'
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed. Please try again.');
                setLoading(false);
                return;
            }

            // Auto sign-in after successful registration
            const signInResult = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (signInResult?.ok) {
                router.push('/dashboard');
            } else {
                router.push('/login?registered=true');
            }
        } catch {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    const handleSocialRegister = async (provider) => {
        setSocialLoading(provider);
        await signIn(provider, { callbackUrl: '/dashboard' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#85A9D2] via-[#A8C4E5] to-[#F5F5F7] flex flex-col items-center justify-center p-4 relative py-12">

            {/* Logo */}
            <div className="mb-6 flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg text-[#3CA9DB] font-bold text-lg">D</div>
                    <span className="text-2xl font-bold text-white tracking-tight">DocSchedule</span>
                </Link>
            </div>

            <div className="w-full max-w-[520px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-[#F5F5F7]">
                            <div className="w-full h-full rounded-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                                <UserCircle className="w-8 h-8 text-blue-200 mt-1" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mb-1 tracking-tight">Create Account</h1>
                        <p className="text-[#666666] text-sm">Join the future of healthcare scheduling.</p>
                    </div>

                    {/* Role Selector */}
                    <div className="flex gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('patient')}
                            className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${role === 'patient' ? 'border-[#3CA9DB] bg-[#3CA9DB]/5 text-[#3CA9DB]' : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-100'}`}
                        >
                            <UserCircle className={`w-5 h-5 ${role === 'patient' ? 'text-[#3CA9DB]' : 'text-gray-400'}`} />
                            <span className="text-[13px] font-bold">Patient</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('doctor')}
                            className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${role === 'doctor' ? 'border-[#3CA9DB] bg-[#3CA9DB]/5 text-[#3CA9DB]' : 'border-gray-50 bg-gray-50/50 text-gray-400 hover:border-gray-100'}`}
                        >
                            <Stethoscope className={`w-5 h-5 ${role === 'doctor' ? 'text-[#3CA9DB]' : 'text-gray-400'}`} />
                            <span className="text-[13px] font-bold">Doctor</span>
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-800 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User className="w-4 h-4" /></div>
                                <input name="fullName" type="text" placeholder="John Doe" value={form.fullName} onChange={handleChange} required
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] focus:ring-4 focus:ring-[#3CA9DB]/10 outline-none transition-all placeholder:text-gray-300 text-sm" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-800 ml-1">Email</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="w-4 h-4" /></div>
                                <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] focus:ring-4 focus:ring-[#3CA9DB]/10 outline-none transition-all placeholder:text-gray-300 text-sm" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-800 ml-1">Phone</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone className="w-4 h-4" /></div>
                                <input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] focus:ring-4 focus:ring-[#3CA9DB]/10 outline-none transition-all placeholder:text-gray-300 text-sm" />
                            </div>
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-800 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-4 h-4" /></div>
                                <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] focus:ring-4 focus:ring-[#3CA9DB]/10 outline-none transition-all placeholder:text-gray-300 text-sm" />
                            </div>
                        </div>

                        <div className="col-span-2 mt-2">
                            <button type="submit" disabled={loading}
                                className="w-full py-4 bg-[#3CA9DB] text-white rounded-xl font-bold text-base hover:bg-[#3498C5] transition-all shadow-[0_8px_16px_rgba(60,169,219,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                                {loading ? 'Creating account...' : `Register as ${role === 'patient' ? 'Patient' : 'Doctor'}`}
                            </button>
                        </div>
                    </form>

                    {/* OR Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                            <span className="bg-white px-4 text-gray-400 font-bold">Or register with</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialRegister('google')}
                            disabled={!!socialLoading}
                            className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group disabled:opacity-60">
                            {socialLoading === 'google' ? (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            ) : (
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                            )}
                            <span className="text-[13px] font-bold text-gray-700">Google</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialRegister('github')}
                            disabled={!!socialLoading}
                            className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group disabled:opacity-60">
                            {socialLoading === 'github' ? (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            ) : (
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.73.084-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                </svg>
                            )}
                            <span className="text-[13px] font-bold text-gray-700">GitHub</span>
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-4">
                        <p className="text-[#666666] text-sm">
                            Already have an account? <Link href="/login" className="text-[#3CA9DB] font-bold hover:underline">Sign in</Link>
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
