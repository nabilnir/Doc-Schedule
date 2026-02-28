"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, CalendarCheck2, Users, Building2,
  MessageSquare, Settings, LogOut, ChevronLeft, Menu,
  UserPlus, BarChart3, ClipboardList, Clock9
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const role = session?.user?.role || "patient";

  const getNavItems = (role) => {
    switch (role) {
      case "admin":
        return [
          { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
          { icon: Users, label: "Manage Patients", href: "/dashboard/admin/patients" },
          { icon: UserPlus, label: "Manage Doctors", href: "/dashboard/admin/doctors" },
          { icon: BarChart3, label: "Analytics", href: "/dashboard/admin/analytics" },
          { icon: Settings, label: "Setting", href: "/dashboard/settings" },
        ];
      case "doctor":
        return [
          { icon: LayoutDashboard, label: "Doctor Portal", href: "/dashboard" },
          { icon: CalendarCheck2, label: "My Appointments", href: "/dashboard/doctor/appointments" },
          { icon: ClipboardList, label: "Patient Records", href: "/dashboard/doctor/records" },
          { icon: Clock9, label: "My Schedule", href: "/dashboard/doctor/schedule" },
          { icon: Settings, label: "Setting", href: "/dashboard/settings" },
        ];
      default: // patient
        return [
          { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
          { icon: CalendarCheck2, label: "My Bookings", href: "/dashboard/appointment" },
          { icon: Users, label: "Find Doctors", href: "/all-doctors" },
          { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
          { icon: Settings, label: "Setting", href: "/dashboard/settings" },
        ];
    }
  };

  const navItems = getNavItems(role);

  // Reusable Sidebar Component
  const SidebarContent = ({ collapsed = false }) => (
    <div className="flex flex-col h-full py-6">
      {/* Brand Logo */}
      <Link href="/">
        <div className={cn("px-6 mb-10 flex items-center gap-3", collapsed ? "justify-center" : "")}>
          <div className="min-w-[40px] h-10 bg-[#7BA1C7] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 font-bold text-xl transition-all duration-300">
            D
          </div>
          {!collapsed && <span className="font-bold text-2xl tracking-tight text-slate-800">DocSchedule</span>}
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#7BA1C7]",
                collapsed && "justify-center px-0 w-12 mx-auto"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-[#7BA1C7]")} />
              {!collapsed && <span className="ml-3 font-semibold">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-4 mt-auto border-t border-slate-100 pt-6">
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: '/' })}
          className={cn(
            "w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-12",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-bold uppercase tracking-wider text-[11px]">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC]">

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={cn(
        "relative border-r bg-white hidden lg:flex flex-col transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20",
        isCollapsed ? "w-20" : "w-72"
      )}>
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-white border border-slate-100 shadow-md rounded-full p-1 z-50 hover:bg-slate-50 hover:scale-110 transition-transform"
        >
          {isCollapsed ? <Menu className="w-3 h-3 text-[#7BA1C7]" /> : <ChevronLeft className="w-3 h-3 text-[#7BA1C7]" />}
        </button>
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* HEADER COMPONENT */}
        <DashboardHeader SidebarContent={SidebarContent} />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}