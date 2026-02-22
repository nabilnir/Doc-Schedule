"use client";

import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 md:pt-[120px] pb-10 md:pb-20 overflow-hidden">
            <div className="container mx-auto max-w-[1440px] px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
                    {/* Brand */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#7BA1C7] rounded-xl flex items-center justify-center">
                                <span className="text-black font-bold text-2xl">D</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">DocSchedule</span>
                        </div>
                        <p className="text-white/40 max-w-[300px] leading-relaxed">
                            Simplifying healthcare connections for doctors and patients nationwide.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h5 className="font-bold uppercase tracking-widest text-xs text-white/40">Product</h5>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-white/80 hover:text-[#7BA1C7] transition-colors">Features</a></li>
                            <li><a href="#" className="text-white/80 hover:text-[#7BA1C7] transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-white/80 hover:text-[#7BA1C7] transition-colors">Integrations</a></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h5 className="font-bold uppercase tracking-widest text-xs text-white/40">Company</h5>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-white/80 hover:text-[#7BA1C7] transition-colors">About</a></li>
                            <li><a href="#" className="text-white/80 hover:text-[#7BA1C7] transition-colors">Privacy</a></li>
                            <li><a href="#" className="text-white/80 hover:text-[#7BA1C7] transition-colors">Terms</a></li>
                        </ul>
                    </div>

                    {/* CTA Group */}
                    <div className="md:col-span-4 bg-[#1A1A1A] p-8 md:p-10 rounded-[30px] md:rounded-[40px] border border-white/5 space-y-6">
                        <h5 className="text-xl md:text-2xl font-bold">Ready to digitize your practice?</h5>
                        <p className="text-white/60 text-sm md:text-base">Join 500+ professionals using DocSchedule today.</p>
                        <a
                            href="/register"
                            className="flex items-center justify-center w-full py-4 bg-[#7BA1C7] text-black rounded-full font-bold hover:scale-[1.02] transition-transform"
                        >
                            Sign up for free
                        </a>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/20 text-sm">© 2026 DocSchedule. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-white/20 hover:text-white transition-colors"><TwitterIcon className="w-5 h-5" /></a>
                        <a href="#" className="text-white/20 hover:text-white transition-colors"><LinkedInIcon className="w-5 h-5" /></a>
                        <a href="#" className="text-white/20 hover:text-white transition-colors"><GithubIcon className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const TwitterIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
);

const LinkedInIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
);

const GithubIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.21 0 1.6-.015 2.885-.015 3.285 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
);

export default Footer;
