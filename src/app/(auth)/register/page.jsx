"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Phone, Mail, Lock, ChevronRight, Stethoscope, UserCircle, Loader2, KeyRound } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState('patient');
    const [loading, setLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false); // OTP state
    const [otp, setOtp] = useState('');
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

    // Step 1: Handle Initial Registration
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
                setError(data.error || 'Registration failed.');
                setLoading(false);
                return;
            }

            // OTP sent, verification step
            setIsVerifying(true);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Handle OTP Verification & Auto Login
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                // OTP verify 
                const result = await signIn('credentials', {
                    redirect: false,
                    email: form.email,
                    password: form.password,
                });

                if (result?.ok) {
                    router.push('/dashboard');
                } else {
                    router.push('/login?verified=true');
                }
            } else {
                setError(data.error || 'Invalid OTP');
            }
        } catch (err) {
            setError('Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#85A9D2] via-[#A8C4E5] to-[#F5F5F7] flex flex-col items-center justify-center p-4 relative py-12">
            
            {/* Logo */}
            <div className="mb-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg text-[#3CA9DB] font-bold text-lg">D</div>
                    <span className="text-2xl font-bold text-white tracking-tight">DocSchedule</span>
                </Link>
            </div>

            <div className="w-full max-w-[520px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden">
                <div className="p-8">
                    
                    {!isVerifying ? (
                        /* --- Registration Form UI --- */
                        <div className="animate-in fade-in duration-500">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-[#F5F5F7]">
                                    <UserCircle className="w-8 h-8 text-blue-200 mt-1" />
                                </div>
                                <h1 className="text-2xl font-bold mb-1 tracking-tight">Create Account</h1>
                                <p className="text-[#666666] text-sm">Join the future of healthcare scheduling.</p>
                            </div>

                            <div className="flex gap-3 mb-6">
                                <button type="button" onClick={() => setRole('patient')} 
                                    className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${role === 'patient' ? 'border-[#3CA9DB] bg-[#3CA9DB]/5 text-[#3CA9DB]' : 'border-gray-50 bg-gray-50/50 text-gray-400'}`}>
                                    <UserCircle className="w-5 h-5" />
                                    <span className="text-[13px] font-bold">Patient</span>
                                </button>
                                <button type="button" onClick={() => setRole('doctor')} 
                                    className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${role === 'doctor' ? 'border-[#3CA9DB] bg-[#3CA9DB]/5 text-[#3CA9DB]' : 'border-gray-50 bg-gray-50/50 text-gray-400'}`}>
                                    <Stethoscope className="w-5 h-5" />
                                    <span className="text-[13px] font-bold">Doctor</span>
                                </button>
                            </div>

                            {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">{error}</div>}

                            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-4">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-800 ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User className="w-4 h-4" /></div>
                                        <input name="fullName" type="text" placeholder="John Doe" value={form.fullName} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] focus:ring-4 focus:ring-[#3CA9DB]/10 outline-none transition-all text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-800 ml-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="w-4 h-4" /></div>
                                        <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] outline-none text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-800 ml-1">Phone</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone className="w-4 h-4" /></div>
                                        <input name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] outline-none text-sm" />
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-800 ml-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-4 h-4" /></div>
                                        <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] outline-none text-sm" />
                                    </div>
                                </div>
                                <div className="col-span-2 mt-2">
                                    <button type="submit" disabled={loading} className="w-full py-4 bg-[#3CA9DB] text-white rounded-xl font-bold text-base hover:bg-[#3498C5] transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                                        Register as {role === 'patient' ? 'Patient' : 'Doctor'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        /* --- OTP Verification UI --- */
                        <div className="animate-in zoom-in duration-300 py-4 text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <KeyRound className="w-8 h-8 text-[#3CA9DB]" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                            <p className="text-gray-500 text-sm mb-8">Weve sent a 6-digit code to <br/><strong>{form.email}</strong></p>

                            {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}

                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full text-center text-3xl tracking-[10px] font-bold py-4 border-2 border-gray-100 rounded-2xl focus:border-[#3CA9DB] outline-none transition-all"
                                    required
                                />
                                <button type="submit" disabled={loading} className="w-full py-4 bg-[#3CA9DB] text-white rounded-xl font-bold text-lg hover:bg-[#3498C5] transition-all flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Create Account"}
                                </button>
                                <button type="button" onClick={() => setIsVerifying(false)} className="text-sm text-gray-400 hover:text-gray-600 font-medium">
                                    Change email address
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mt-8 text-[#666666]/70 text-[13px] font-medium">© 2026 DocSchedule App</div>
        </div>
    );
}