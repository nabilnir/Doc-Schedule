"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    User, Mail, Phone, Camera, Save, Lock,
    ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        image: ""
    });

    const fileInputRef = React.useRef(null);

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        if (session?.user) {
            setProfileForm({
                fullName: session.user.name || "",
                email: session.user.email || "",
                phone: session.user.phone || "",
                image: session.user.image || ""
            });
        }
    }, [session]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        if (!apiKey) {
            setMessage({ type: "error", text: "ImgBB API Key is missing in .env.local" });
            return;
        }

        setUploading(true);
        setMessage({ type: "", text: "" });

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                const imageUrl = data.data.url;
                setProfileForm(prev => ({ ...prev, image: imageUrl }));
                setMessage({ type: "success", text: "Image uploaded! Click 'Save Changes' to update profile." });
            } else {
                setMessage({ type: "error", text: data.error?.message || "Upload failed" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to connect to ImgBB" });
        } finally {
            setUploading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        console.log("Submitting Profile Update:", profileForm);

        try {
            const res = await fetch("/api/user/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileForm),
            });

            const data = await res.json();
            console.log("Profile Update Response:", data);

            if (res.ok) {
                setMessage({ type: "success", text: data.message });
                // Update the session to reflect changes in header/sidebar
                await update({
                    user: {
                        name: profileForm.fullName,
                        email: profileForm.email,
                        image: profileForm.image,
                        phone: profileForm.phone
                    }
                });
            } else {
                setMessage({ type: "error", text: data.error || "Failed to update profile" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/user/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Password updated successfully" });
                setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                setMessage({ type: "error", text: data.error || "Failed to update password" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 mt-1">Manage your profile information and security preferences.</p>
            </div>

            {message.text && (
                <div className={cn(
                    "p-4 rounded-2xl flex items-center gap-3 border animate-in slide-in-from-top-2",
                    message.type === "success"
                        ? "bg-green-50 border-green-100 text-green-700"
                        : "bg-red-50 border-red-100 text-red-700"
                )}>
                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Profile Card */}
                <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl">
                    <CardHeader className="pb-0 pt-8 px-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl">
                                <User className="w-6 h-6 text-[#7BA1C7]" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">Profile Details</CardTitle>
                                <CardDescription>Update your personal information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleProfileUpdate} className="space-y-6">

                            {/* Avatar Upload Section */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <Avatar className={cn(
                                        "h-24 w-24 border-4 border-white shadow-xl ring-2 ring-slate-50 transition-all group-hover:ring-slate-100",
                                        uploading && "opacity-50"
                                    )}>
                                        <AvatarImage src={profileForm.image} />
                                        <AvatarFallback className="bg-[#7BA1C7] text-white text-2xl font-bold">
                                            {profileForm.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        {uploading ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Camera className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <div className="flex-1 space-y-2 text-center sm:text-left">
                                    <Label className="text-base text-slate-900 font-semibold group-hover:text-[#7BA1C7] transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        Profile Photo
                                    </Label>
                                    <Input
                                        value={profileForm.image}
                                        onChange={(e) => setProfileForm({ ...profileForm, image: e.target.value })}
                                        placeholder="Enter image URL..."
                                        className="bg-slate-50 border-none rounded-xl h-11 focus-visible:ring-[#7BA1C7]"
                                    />
                                    <p className="text-[11px] text-slate-400">Click the photo to upload or paste a URL above.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            value={profileForm.fullName}
                                            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                                            placeholder="John Doe"
                                            className="pl-11 bg-slate-50 border-none rounded-xl h-12 focus-visible:ring-[#7BA1C7] font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                            placeholder="john@example.com"
                                            className="pl-11 bg-slate-50 border-none rounded-xl h-12 focus-visible:ring-[#7BA1C7] font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            placeholder="+1 (555) 000-0000"
                                            className="pl-11 bg-slate-50 border-none rounded-xl h-12 focus-visible:ring-[#7BA1C7] font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-black hover:bg-slate-800 text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                    {!loading && <Save className="ml-2 w-4 h-4" />}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Right Column: Security Card */}
                <div className="space-y-8">
                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl">
                        <CardHeader className="pb-4 pt-8 px-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <Lock className="w-5 h-5 text-[#7BA1C7]" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">Security</CardTitle>
                                    <CardDescription>Update your account password</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <form onSubmit={handlePasswordUpdate} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPasswords.old ? "text" : "password"}
                                            value={passwordForm.oldPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                            className="bg-slate-50 border-none rounded-xl h-11 focus-visible:ring-[#7BA1C7] pr-11"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showPasswords.new ? "text" : "password"}
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                className="bg-slate-50 border-none rounded-xl h-11 focus-visible:ring-[#7BA1C7] pr-11"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirm New Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showPasswords.confirm ? "text" : "password"}
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                className="bg-slate-50 border-none rounded-xl h-11 focus-visible:ring-[#7BA1C7] pr-11"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading || !passwordForm.newPassword}
                                    className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-11 font-bold shadow-lg transition-all"
                                >
                                    Update Password
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                        <CardHeader className="pb-4">
                            <ShieldCheck className="w-8 h-8 mb-2 text-[#7BA1C7]" />
                            <CardTitle className="text-lg">Two-Factor Auth</CardTitle>
                            <CardDescription className="text-slate-100/70">Add an extra layer of security to your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl h-11 font-bold">
                                Enable 2FA
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

