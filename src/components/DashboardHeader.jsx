"use client";
import React, { useState, useEffect } from "react";
import { Bell, User, Clock, Search, Home, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

export default function DashboardHeader() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications/list");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        const unread = data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  // Mark all notifications as read
  const handleMarkAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/mark-read", {
        method: "POST",
      });
      if (res.ok) {
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        );
      }
    } catch (err) {
      console.error("Error marking notifications as read");
    }
  };

  // Polling every 30 seconds to get fresh data
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-6 lg:px-10 transition-all">
      
      {/* Left Side: Search Bar */}
      <div className="relative w-full max-w-xs hidden md:block group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#7BA1C7] transition-colors" />
        <Input
          placeholder="Search patient or doctor..."
          className="pl-11 bg-slate-100/60 border-none rounded-2xl h-11 focus-visible:ring-2 focus-visible:ring-[#7BA1C7]/50 transition-all"
        />
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-3 lg:gap-5">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-500 hover:bg-slate-100 transition-all">
            <Home className="w-5 h-5" />
          </Button>
        </Link>

        {/* Notification Bell Popover */}
        {!isMounted ? (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-slate-200"
            >
              <Bell className="w-5 h-5 text-slate-400" />
            </Button>
        ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl h-10 w-10 bg-slate-100/50 text-slate-600 hover:bg-slate-100 transition-all">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-4 ring-white animate-in zoom-in">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[380px] p-0 rounded-[24px] shadow-2xl border-slate-100 overflow-hidden mt-2" align="end">
            {/* Popover Header */}
            <div className="p-5 bg-white border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Notifications</h3>
                <p className="text-xs text-slate-500">You have {unreadCount} unread updates</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAsRead}
                className="text-[11px] font-bold text-[#7BA1C7] hover:bg-blue-50"
                disabled={unreadCount === 0}
              >
                Mark all read
              </Button>
            </div>

            {/* Notifications List */}
            <ScrollArea className="h-[450px] bg-white">
              {notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map((notif) => {
                    // Logic: Use the 'status' field from your DB
                    const isConfirmed = notif.status === "confirmed";
                    
                    return (
                      <div 
                        key={notif._id} 
                        className={`p-4 border-b last:border-0 transition-colors hover:bg-slate-50/80 ${!notif.isRead ? "bg-blue-50/40" : ""}`}
                      >
                        <div className="flex gap-4">
                          {/* Left: Icon Badge */}
                          <div className={`h-10 w-10 rounded-full shrink-0 flex items-center justify-center ${isConfirmed ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                            {isConfirmed ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                          </div>

                          {/* Right: Notification Body */}
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <p className="text-sm text-slate-600 leading-snug">
                                  <span className="font-bold text-slate-900">{notif.name || "A user"}</span> 
                                  {isConfirmed ? " has a confirmed appointment." : " started a booking (Awaiting Payment)."}
                                </p>
                                {!notif.isRead && <div className="h-2 w-2 bg-[#7BA1C7] rounded-full mt-1 shrink-0 shadow-[0_0_8px_#7BA1C7]"></div>}
                            </div>

                            {/* Details Box */}
                            <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm space-y-1.5">
                              <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">Dr. {notif.doctorName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {notif.timeSlot || "Time not set"}
                                </span>
                              </div>
                            </div>

                            {/* Timestamp */}
                            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              {format(new Date(notif.createdAt), "PPp")}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
                  <div className="bg-slate-100 p-4 rounded-full mb-3">
                    <Bell className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No notifications yet</p>
                  <p className="text-xs text-slate-400">Updates about your bookings will appear here.</p>
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
        )}

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 shrink-0 h-10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none mb-1">{session?.user?.name || "User"}</p>
            <p className="text-[10px] font-bold text-[#7BA1C7] tracking-wider uppercase">{session?.user?.role || "Member"}</p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-white shadow-md transition-transform hover:scale-105 cursor-pointer">
            <AvatarImage src={session?.user?.image} />
            <AvatarFallback className="bg-gradient-to-br from-[#7BA1C7] to-[#5a8bb8] text-white text-xs font-bold">
               {session?.user?.name?.substring(0, 2).toUpperCase() || "GU"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}