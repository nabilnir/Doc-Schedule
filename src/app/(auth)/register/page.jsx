"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Phone, Mail, Lock, ChevronRight, Stethoscope, UserCircle, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState('patient');
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false); // OTP state
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

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
                    window.location.href = '/dashboard';
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

    // Timer logic for resending OTP
    React.useEffect(() => {
        let timer;
        if (isVerifying && resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [isVerifying, resendTimer]);

    const handleResendOTP = async () => {
        if (!canResend) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/resend-registration-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email }),
            });

            if (res.ok) {
                setResendTimer(60);
                setCanResend(false);
                // Optionally show a success toast here
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



    const handleSocialLogin = async (provider) => {
        setSocialLoading(provider);
        await signIn(provider, { callbackUrl: '/dashboard' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#85A9D2] via-[#A8C4E5] to-[#F5F5F7] flex flex-col items-center justify-center p-4 relative py-8">

            {/* Logo */}
            <div className="mb-4 flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg text-[#3CA9DB] font-bold text-lg">D</div>
                    <span className="text-2xl font-bold text-white tracking-tight">DocSchedule</span>
                </Link>
            </div>

            <div className="w-full max-w-[520px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden">
                <div className="p-6 sm:p-8 pt-6">

                    {!isVerifying ? (
                        /* --- Registration Form UI --- */
                        <div className="animate-in fade-in duration-500">
                            <div className="flex flex-col items-center text-center mb-5">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-[#F5F5F7]">
                                    <UserCircle className="w-8 h-8 text-blue-200 mt-1" />
                                </div>
                                <h1 className="text-2xl font-bold mb-1 tracking-tight">Create Account</h1>
                                <p className="text-[#666666] text-sm">Join the future of healthcare scheduling.</p>
                            </div>

                            <div className="flex gap-3 mb-5">
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
                                            minLength={6}
                                            className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#3CA9DB] outline-none text-sm transition-all focus:ring-4 focus:ring-[#3CA9DB]/10"
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
                                <div className="col-span-2 mt-2">
                                    <button type="submit" disabled={loading} className="w-full py-4 bg-[#3CA9DB] text-white rounded-xl font-bold text-base hover:bg-[#3498C5] transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                                        Register as {role === 'patient' ? 'Patient' : 'Doctor'}
                                    </button>
                                </div>
                            </form>

                            {/* OR Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                                    <span className="bg-white px-4 text-gray-400 font-bold">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Buttons */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button type="button" onClick={() => handleSocialLogin('google')} disabled={!!socialLoading}
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
                                <button type="button" onClick={() => handleSocialLogin('github')} disabled={!!socialLoading}
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

                            <div className="mt-6 pt-5 border-t border-gray-100 text-center space-y-3">
                                <p className="text-[#666666] text-sm">
                                    Already have an account? <Link href="/login" className="text-[#3CA9DB] font-bold hover:underline">Sign in</Link>
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* --- OTP Verification UI --- */
                        <div className="animate-in zoom-in duration-300 py-4 text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <KeyRound className="w-8 h-8 text-[#3CA9DB]" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                            <p className="text-gray-500 text-sm mb-8">Weve sent a 6-digit code to <br /><strong>{form.email}</strong></p>

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

                                <div className="pt-2">
                                    <p className="text-gray-400 text-sm">
                                        Didn&apos;t get code?{' '}
                                        {canResend ? (
                                            <button
                                                type="button"
                                                onClick={handleResendOTP}
                                                className="text-[#3CA9DB] font-bold hover:underline"
                                            >
                                                Resend Code
                                            </button>
                                        ) : (
                                            <span className="text-gray-300 font-medium">Resend in {resendTimer}s</span>
                                        )}
                                    </p>
                                </div>

                                <button type="button" onClick={() => setIsVerifying(false)} className="text-sm text-gray-400 hover:text-gray-600 font-medium pt-4">
                                    Change email address
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-[#666666]/70 text-[13px] font-medium">© 2026 DocSchedule App</div>
        </div >
    );
}