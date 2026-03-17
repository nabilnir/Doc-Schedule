"use client";

import React from 'react';
import { CreditCard, Lock, ShieldCheck, Zap } from 'lucide-react';

const PaymentGatewaySection = () => {
    return (
        <section className="py-20 md:py-[120px] bg-white overflow-hidden" id="payments">
            <div className="container mx-auto max-w-[1440px] px-6 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-20">

                    {/* Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full border border-white/10 mb-8">
                            <CreditCard className="w-4 h-4 text-[#7BA1C7]" />
                            <span className="text-[15px] font-semibold uppercase tracking-wider">Secure Payments</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-[56px] font-bold leading-[1.1] text-[#1A1A1A] mb-8 flex flex-wrap items-center gap-x-4">
                            Integrated
                            <img src="/brand/stripe.png" alt="Stripe" className="h-10 md:h-14 object-contain inline-block" />
                            processing.
                        </h2>
                        <p className="text-base md:text-[20px] text-[#666666] leading-relaxed mb-10">
                            Collect consultation fees upfront. Patients pay securely via Stripe before booking confirmation.
                        </p>

                        <ul className="space-y-4 md:space-y-6">
                            <li className="flex items-center gap-4">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-black rounded-full flex items-center justify-center text-white shrink-0">
                                    <CheckIcon className="w-3 h-3 md:w-4 md:h-4" />
                                </div>
                                <span className="text-base md:text-lg font-medium">Instant Payouts to Doctors</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-black rounded-full flex items-center justify-center text-white shrink-0">
                                    <CheckIcon className="w-3 h-3 md:w-4 md:h-4" />
                                </div>
                                <span className="text-base md:text-lg font-medium">Automatic Invoicing</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-black rounded-full flex items-center justify-center text-white shrink-0">
                                    <CheckIcon className="w-3 h-3 md:w-4 md:h-4" />
                                </div>
                                <span className="text-base md:text-lg font-medium">Multi-currency Support</span>
                            </li>
                        </ul>
                    </div>

                    {/* Visual: Checkout UI */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-2xl border border-[#E5E5E5] relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-8 md:mb-10">
                                <div className="flex flex-col">
                                    <span className="text-xs md:text-sm text-gray-400 font-bold uppercase">Amount Due</span>
                                    <span className="text-3xl md:text-4xl font-bold">$50.00</span>
                                </div>
                                <div className="w-12 h-8 md:w-16 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-5 border-2 border-black rounded-2xl flex justify-between items-center group-hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold">Credit Card</span>
                                    </div>
                                    <div className="w-5 h-5 border-2 border-black rounded-full flex items-center justify-center">
                                        <div className="w-3 h-3 bg-black rounded-full"></div>
                                    </div>
                                </div>

                                <div className="p-5 border border-[#E5E5E5] rounded-2xl flex justify-between items-center opacity-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-gray-400">Digital Wallet</span>
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-xl">
                                    <ShieldCheck className="w-6 h-6" />
                                    Pay Securely
                                </button>

                                <p className="text-center text-xs text-gray-400">Powered by Stripe Connect</p>
                            </div>

                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7BA1C7]/10 rounded-bl-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CheckIcon = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default PaymentGatewaySection;
