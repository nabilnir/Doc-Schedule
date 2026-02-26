"use client";
import React, { useState, useEffect } from "react";
import { Bell, Calendar, User, Clock, Search, Menu, Home } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import * as Tooltip from "@radix-ui/react-tooltip"; // If needed, but let's stick to Sheet

export default function DashboardHeader({ SidebarContent }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Notification list and count fetching function
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications/list");
      const data = await res.json();
      setNotifications(data);
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  // Mark as Read function
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

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6 lg:px-10">

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
              <Menu className="w-6 h-6 text-slate-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-white border-r">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Brand for mobile */}
        <div className="sm:hidden font-bold text-xl tracking-tight text-slate-800">
          DocSchedule
        </div>
      </div>

      {/* Search Bar - Desktop */}
      <div className="relative w-full max-w-xs hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search..."
          className="pl-12 bg-slate-100/50 border-none rounded-2xl h-11 focus-visible:ring-[#7BA1C7]"
        />
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        {/* Home Button */}
        <Link href="/">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 border-slate-200 hover:bg-slate-50 transition-all"
          >
            <Home className="w-5 h-5 text-slate-600" />
          </Button>
        </Link>

        {/* Notification Bell Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full h-10 w-10 border-slate-200 hover:bg-slate-50 transition-all"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7BA1C7] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-80 p-0 rounded-3xl shadow-2xl border-slate-100 overflow-hidden"
            align="end"
          >
            <div className="p-5 bg-white border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-slate-100 text-[#7BA1C7] px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} New
                </span>
              )}
            </div>

            <ScrollArea className="h-[350px] bg-white">
              {notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map((notif) => {
                    // Logic to separate doctor and time from message
                    // Format: "Name booked Dr. Name at Time"
                    const parts = notif.message.split(" booked ");
                    const doctorName = parts[1]?.split(" at ")[0] || "Doctor";
                    const appointmentTime = notif.message.split(" at ")[1] || "Time not set";

                    return (
                      <div
                        key={notif._id}
                        className={`p-4 border-b last:border-0 hover:bg-slate-50 transition-colors ${!notif.isRead ? "bg-blue-50/40" : ""
                          }`}
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <p className="text-[10px] font-black uppercase tracking-wider text-[#7BA1C7]">
                            Appointment Alert
                          </p>
                          {!notif.isRead && (
                            <div className="h-2 w-2 bg-[#7BA1C7] rounded-full"></div>
                          )}
                        </div>

                        <div className="space-y-2">
                          {/* Doctor name*/}
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span className="truncate">{doctorName}</span>
                          </div>

                          {/* Appointment time */}
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>{appointmentTime}</span>
                          </div>

                          {/* When the notification arrives */}
                          <p className="text-[10px] text-slate-400 font-medium pt-1">
                            {format(new Date(notif.createdAt), "PPp")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center flex flex-col items-center justify-center">
                  <Bell className="h-8 w-8 text-slate-200 mb-2" />
                  <p className="text-slate-400 text-sm">No notifications yet.</p>
                </div>
              )}
            </ScrollArea>

            <div className="p-3 bg-slate-50/50 border-t">
              <Button
                variant="ghost"
                disabled={unreadCount === 0}
                onClick={handleMarkAsRead}
                className="text-xs font-bold text-[#7BA1C7] hover:bg-slate-100 hover:text-slate-900 w-full rounded-xl transition-all"
              >
                Mark all as read
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">
              {session?.user?.name || "Guest User"}
            </p>
            <p className="text-[10px] font-medium text-[#7BA1C7] uppercase">
              {session?.user?.role || "Member"}
            </p>
          </div>
          <Avatar className="h-9 w-9 border shadow-sm ring-2 ring-white">
            <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
            <AvatarFallback className="bg-[#7BA1C7] text-white font-bold text-xs">
              {session?.user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "GU"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}