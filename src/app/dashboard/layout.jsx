"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, CalendarCheck2, Users, Building2,
  MessageSquare, Settings, LogOut, Search, Bell,
  ChevronLeft, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: CalendarCheck2, label: "Appointment", href: "/dashboard/appointment" },
    { icon: Users, label: "Doctors", href: "/dashboard/doctors" },
    { icon: Building2, label: "Departments", href: "/dashboard/departments" },
    { icon: MessageSquare, label: "Message", href: "/dashboard/messages" },
    { icon: Settings, label: "Setting", href: "/dashboard/settings" },
  ];

  // Sidebar Menu Component (Reusable for Mobile & Desktop)
  const SidebarContent = ({ collapsed = false }) => (
    <div className="flex flex-col h-full py-6">
      <div className={cn("px-6 mb-8 flex items-center gap-3", collapsed ? "justify-center" : "")}>
        <div className="min-w-[40px] h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 font-bold text-xl">
          D
        </div>
        {!collapsed && <span className="font-bold text-2xl tracking-tight text-slate-800">DocSchedule</span>}
      </div>

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
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-blue-600",
                collapsed && "justify-center px-0 w-12 mx-auto"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600")} />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto border-t pt-4">
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: '/' })}
          className={cn("w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl", collapsed && "justify-center px-0")}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-semibold">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={cn(
        "relative border-r bg-white hidden lg:flex flex-col transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-white border shadow-sm rounded-full p-1 z-50 hover:bg-slate-50"
        >
          {isCollapsed ? <Menu className="w-4 h-4 text-slate-500" /> : <ChevronLeft className="w-4 h-4 text-slate-500" />}
        </button>
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-20 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6 lg:px-10">

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="font-bold text-xl text-blue-600 lg:hidden">OneWorld</span>
          </div>

          <div className="relative w-full max-w-xs hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search..." className="pl-12 bg-slate-100/50 border-none rounded-2xl h-11" />
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <Button variant="outline" size="icon" className="relative rounded-full h-10 w-10 shrink-0">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </Button>

            <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Kamalesh Roy</p>
                <p className="text-[10px] font-medium text-blue-600 uppercase">Student</p>
              </div>
              <Avatar className="h-9 w-9 border shadow-sm">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>KR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}