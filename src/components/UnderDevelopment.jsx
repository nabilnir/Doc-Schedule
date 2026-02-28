"use client";
import React from "react";
import { Hammer, Construction, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnderDevelopment({ title, description, icon: Icon }) {
    return (
        <div className="h-[60vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
            <Card className="max-w-md w-full border-none shadow-2xl shadow-slate-100 rounded-[40px] overflow-hidden bg-white text-center">
                <CardContent className="p-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8 relative">
                        <Icon className="w-12 h-12 text-[#7BA1C7]" />
                        <div className="absolute -top-2 -right-2 bg-black rounded-full p-2 shadow-lg border-4 border-white">
                            <Hammer className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">{title}</h1>
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full mb-6">
                        <Construction className="w-4 h-4 text-[#7BA1C7]" />
                        <span className="text-xs font-bold text-[#7BA1C7] uppercase tracking-widest">Under Development</span>
                    </div>

                    <p className="text-slate-500 text-lg leading-relaxed mb-8">
                        {description || "We're working hard to bring you this feature. Stay tuned for updates!"}
                    </p>

                    <Link href="/dashboard" className="w-full">
                        <Button className="w-full h-14 bg-black hover:bg-slate-800 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] flex gap-2 items-center justify-center">
                            <ArrowLeft className="w-5 h-5" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
