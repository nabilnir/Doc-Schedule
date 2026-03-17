"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  BarChart3, Users, CalendarCheck2, Clock,
  TrendingUp, PlusCircle, ArrowRight, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session?.user?.role === "doctor") {
      checkDoctorProfile();
    }
    
    fetchDashboardStats();
  }, [session, status]);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch("/api/user/dashboard-stats");
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Fetch dashboard stats error:", err);
    } finally {
      if (session?.user?.role !== "doctor") {
        setLoading(false);
      }
    }
  };

  const checkDoctorProfile = async () => {
    try {
      const res = await fetch("/api/user/check-doctor-profile");
      const data = await res.json();
      setHasProfile(data.hasProfile);
    } catch (err) {
      console.error("Check profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#7BA1C7] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  const role = (session?.user?.role || "patient").toLowerCase();

  if (role === "doctor" && !hasProfile) {
    return <DoctorOnboardingPrompt />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-slate-500 mt-1 capitalize">{role} Dashboard Overview</p>
        </div>
        <Button 
          onClick={() => {
            if (role === "admin") router.push("/dashboard/admin");
            else if (role === "doctor") router.push("/dashboard/doctor/schedule");
            else router.push("/dashboard/book-appointment");
          }}
          className="bg-black hover:bg-slate-800 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-5 h-5 mr-2 text-[#7BA1C7]" />
          {role === "admin" ? "Admit User" : role === "doctor" ? "Add Slot" : "Book Appointment"}
        </Button>
      </div>

      {role === "admin" && <AdminView />}
      {role === "doctor" && <DoctorView data={dashboardData} />}
      {role === "patient" && <PatientView data={dashboardData} />}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function DoctorOnboardingPrompt() {
  const router = useRouter();
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-xl w-full border-none shadow-2xl shadow-slate-100 rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="pt-10 px-10 pb-0 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-[#7BA1C7]" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-slate-800">Complete Your Profile</CardTitle>
          <p className="text-slate-500 mt-4 text-lg leading-relaxed">
            Welcome to the medical team! To start consulting and managing appointments, we need a few details about your expertise and schedule.
          </p>
        </CardHeader>
        <CardContent className="p-10 text-center">
          <Button
            onClick={() => router.push("/dashboard/doctor/onboarding")}
            className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl text-lg font-bold shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Start Onboarding
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="mt-6 text-sm text-slate-400 font-medium italic">
            Estimated time: 2 minutes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminView() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0
  });
  const [revenueData, setRevenueData] = useState({
    monthlyRevenue: Array(12).fill(0),
    monthNames: [],
    maxRevenue: 50000,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, revenueRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/revenue")
        ]);
        
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
        
        if (revenueRes.ok) {
          const revData = await revenueRes.json();
          setRevenueData(revData);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-[120px] bg-white rounded-[24px] border border-slate-100 shadow-sm" />
        ))}
        <div className="md:col-span-2 lg:col-span-4 h-64 bg-white rounded-[32px] border border-slate-100 shadow-sm" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LabTenStatCard title="Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} type="revenue" percentage="86%" />
        <LabTenStatCard title="Completed" value={stats.totalAppointments.toLocaleString()} type="completed" percentage="64%" />
        <LabTenStatCard title="Pending" value="150" type="pending" percentage="43%" />
        <LabTenStatCard title="Cancelled" value="42" type="cancelled" percentage="24%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROW 1 LEFT: REVENUE CHART */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center z-10 relative mb-8">
            <h3 className="font-bold text-lg text-slate-800">Total Revenue</h3>
            <div className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold flex items-center gap-2 border border-slate-100 cursor-pointer hover:bg-slate-100">
              This Year <span className="text-[10px]">▼</span>
            </div>
          </div>

          <div className="flex-1 relative min-h-[220px]">
            {/* Generate Y Axis with dynamic range */}
            <RevenueChart data={revenueData} />
          </div>
        </div>

        {/* ROW 1 RIGHT: ACTIVITY MANAGER */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-md text-slate-800">Activity manager</h3>
            <div className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold flex items-center gap-1 border border-slate-100 cursor-pointer">
              Today <span className="text-[10px]">▼</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
              <p className="text-xs font-bold text-slate-800">Doctors</p>
              <div className="bg-white rounded-xl shadow-sm p-3 mt-4 flex flex-col items-center justify-center relative overflow-hidden border border-slate-50">
                <p className="text-3xl font-extrabold text-slate-900">{stats.totalDoctors}</p>
                <p className="text-[9px] text-slate-400 font-medium">Available doctors</p>

                {/* Tiny avatar stack */}
                <div className="flex -space-x-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-200" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`, backgroundSize: 'cover' }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-slate-100 rounded-2xl p-4 flex flex-col bg-white overflow-hidden shadow-sm">
              <p className="text-xs font-bold text-slate-800 mb-2">Patient</p>
              <p className="text-3xl font-extrabold text-slate-900">{stats.totalPatients}</p>
              <p className="text-[9px] text-[#3CA9DB] font-semibold bg-blue-50 px-2 py-0.5 rounded-full inline-block w-max mt-1 mb-4">Updated just now</p>

              <div className="space-y-2 mt-auto text-[10px] font-semibold">
                <div className="flex justify-between items-center"><span className="text-slate-500">Checked In</span><span className="text-blue-500">520</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Pending</span><span className="text-teal-400">215</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Canceled</span><span className="text-red-400">45</span></div>
              </div>
            </div>
          </div>

          {/* Gender Donut Chart Area */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-center relative min-h-[140px] overflow-hidden">
            <span className="absolute top-3 left-4 text-xs font-bold">Gender</span>
            {/* Pure CSS Donut Chart logic representation */}
            <div className="relative w-24 h-24 rounded-full border-[12px] border-blue-50 flex items-center justify-center mt-2">
              {/* Left side teal, right side blue, red sliver via borders is complex, let's use a conic gradient or SVG */}
              <div className="absolute inset-[-12px] rounded-full" style={{ background: 'conic-gradient(#3b82f6 0% 54%, #2dd4bf 54% 96%, #f87171 96% 100%)', WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)' }}></div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner z-10 text-blue-500">
                <Users className="w-4 h-4" />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 text-[9px] font-bold">
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div><span className="text-slate-500">Female: 54.4%</span></div>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div><span className="text-slate-500">Male: 41.6%</span></div>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div><span className="text-slate-500">Other: 4%</span></div>
            </div>
          </div>
        </div>

        {/* ROW 2 LEFT: APPOINTMENTS TABLE */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 shadow-xl shadow-slate-100/50">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Appointments</h3>
          <div className="w-full overflow-x-auto text-sm">
            <table className="w-full text-left min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs">
                  <th className="pb-3 px-2 font-medium">Doctor</th>
                  <th className="pb-3 px-2 font-medium">Time & Date</th>
                  <th className="pb-3 px-2 font-medium">Patient</th>
                  <th className="pb-3 px-2 font-medium">Treatment Type</th>
                  <th className="pb-3 px-2 font-medium">Payment</th>
                  <th className="pb-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockAppointments.map((app, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <img src={app.doctor.img} className="w-9 h-9 rounded-full object-cover border border-slate-200" alt="" />
                        <div>
                          <p className="font-bold text-slate-800">{app.doctor.name}</p>
                          <p className="text-[10px] text-slate-400">{app.doctor.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <p className="font-bold text-slate-800">{app.time}</p>
                      <p className="text-[10px] text-slate-400">{app.date}</p>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <img src={app.patient.img} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{app.patient.name}</p>
                          <p className="text-[10px] text-slate-400">Age {app.patient.age}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 font-medium text-slate-600 text-xs">{app.treatment}</td>
                    <td className="py-4 px-2">
                      <span className={`text-xs font-semibold ${app.payment === 'Pending' ? 'text-amber-500' : app.payment === 'Paid' ? 'text-emerald-500' : 'text-slate-500'}`}>{app.payment}</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold",
                        app.status === 'In progress' ? 'bg-blue-50 text-blue-600' :
                          app.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      )}>{app.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 2 RIGHT: PATIENT REVIEWS */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-md text-slate-800">Patient Reviews</h3>
            <div className="text-xs font-bold text-blue-500 cursor-pointer hover:underline">View All</div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {mockReviews.map((rev, i) => (
              <div key={i} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <img src={rev.img} className="w-8 h-8 rounded-full object-cover" alt="" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{rev.name}</p>
                      <p className="text-[9px] text-slate-400">{rev.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-sm">
                    {rev.rating} <span className="text-amber-400 text-lg leading-none mt-[-2px]">★</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                  &quot;{rev.text}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorView({ data }) {
  const router = useRouter();
  if (!data || !data.stats) return <div className="animate-pulse space-y-4"><div className="h-32 bg-slate-100 rounded-3xl"/><div className="h-64 bg-slate-100 rounded-3xl"/></div>;

  const stats = data.stats;
  const upcoming = data.upcomingAppointments || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Appts" value={stats.todayAppointments} icon={CalendarCheck2} color="blue" />
        <StatCard title="Total Consultations" value={stats.totalConsultations} icon={Users} color="emerald" />
        <StatCard title="Avg Rating" value={`${stats.averageRating}/5`} icon={Activity} color="amber" />
        <StatCard title="Total Earnings" value={`৳${stats.totalEarnings.toLocaleString()}`} icon={TrendingUp} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Appointment Chart */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center z-10 relative mb-8">
            <h3 className="font-bold text-lg text-slate-800">Weekly Appointment Volume</h3>
            <div className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold border border-slate-100 cursor-pointer hover:bg-slate-100">
              Last 7 Days
            </div>
          </div>

          <div className="flex-1 relative min-h-[220px]">
            <DoctorActivityChart data={stats.weeklyVolume} />
          </div>
        </div>

        {/* Upcoming Appointments List */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-md text-slate-800">Upcoming Today</h3>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-[#7BA1C7] hover:text-blue-600" onClick={() => router.push('/dashboard/appointment')}>View All</Button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {upcoming.length > 0 ? upcoming.map((app, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#7BA1C7] font-bold">
                  {app.patientName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{app.patientName}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{app.timeSlot}</p>
                </div>
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Coming Up</div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 font-medium italic">No more appointments today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientView({ data }) {
  const router = useRouter();
  if (!data || !data.stats) return <div className="animate-pulse space-y-4"><div className="h-32 bg-slate-100 rounded-3xl"/><div className="h-64 bg-slate-100 rounded-3xl"/></div>;

  const stats = data.stats;
  const recent = data.recentActivity || [];
  const nextApp = stats.upcomingAppointment;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Next Appointment Hero */}
        <Card className="border-none shadow-2xl shadow-slate-100 rounded-[40px] bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b] text-white overflow-hidden group relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all duration-700 group-hover:scale-110"/>
          <CardContent className="p-10 relative">
            <Clock className="absolute right-[-30px] top-[-30px] w-64 h-64 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"/>
              <p className="text-blue-200 font-bold uppercase tracking-[2px] text-xs">Your Next Session</p>
            </div>

            {nextApp ? (
              <>
                <h3 className="text-4xl font-black mb-8 italic tracking-tight">Ready for your consult?</h3>
                <div className="flex items-center gap-6 bg-white/10 p-6 rounded-[32px] backdrop-blur-xl border border-white/10 mb-8 transition-all hover:bg-white/15">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7BA1C7] to-blue-400 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-blue-500/20">
                    {nextApp.doctorName.charAt(3)}
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{nextApp.doctorName}</p>
                    <div className="flex items-center gap-2 text-blue-100/80 mt-1">
                      <CalendarCheck2 className="w-4 h-4 text-blue-300" />
                      <p className="text-sm font-medium">{new Date(nextApp.appointmentDate).toDateString()} at {nextApp.timeSlot}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="h-14 bg-[#7BA1C7] hover:bg-blue-400 text-white rounded-2xl px-10 text-lg font-black transition-all hover:scale-[1.03] shadow-xl shadow-blue-500/20 flex-1">
                    Join Meeting
                  </Button>
                  <Button variant="outline" className="h-14 bg-transparent border-white/20 text-white hover:bg-white/10 rounded-2xl px-10 text-lg font-bold flex-1" onClick={() => router.push(`/dashboard/appointment/${nextApp._id}`)}>
                    View Details
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-2xl font-bold mb-4">No upcoming appointments</h3>
                <p className="text-blue-100/60 mb-8 max-w-sm mx-auto">Stay on top of your health by scheduling a consultation with our top-rated specialists.</p>
                <Button className="bg-white text-slate-900 hover:bg-blue-50 rounded-2xl h-12 px-8 font-bold" onClick={() => router.push('/dashboard/book-appointment')}>
                  Discover Doctors
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Mini List */}
        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-100/50 border border-slate-50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
            <Button variant="ghost" className="text-xs font-bold text-[#7BA1C7] rounded-xl" onClick={() => router.push('/dashboard/appointment')}>See All History</Button>
          </div>
          <div className="space-y-4">
            {recent.length > 0 ? recent.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#7BA1C7] transition-colors">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Appointment with {item.doctorName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">{new Date(item.appointmentDate).toDateString()} · {item.timeSlot}</p>
                  </div>
                </div>
                <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", 
                  item.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                )}>
                  {item.status}
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-400 py-8 italic font-medium">No recent activities found.</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Right Stats Stack */}
        <StatCard title="Active Prescriptions" value={stats.prescriptionsCount} icon={Activity} color="emerald" trend="+1 New" />
        <StatCard title="Medical Reports" value={stats.reportsCount} icon={BarChart3} color="amber" trend="Synced 5m ago" />
        <StatCard title="Total Consults" value={stats.totalAppointments} icon={Users} color="blue" />

        {/* Health Highlight Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[40px] p-8 relative overflow-hidden group border border-blue-100/50 shadow-inner">
           <TrendingUp className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-blue-500/5 rotate-12" />
           <h4 className="font-black text-lg text-slate-900 mb-6">Health Profile</h4>
           <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm">
               <span className="text-sm font-bold text-slate-500">Blood Type</span>
               <span className="text-lg font-black text-red-500">{stats.bloodGroup || "—"}</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm">
               <span className="text-sm font-bold text-slate-500">Age</span>
               <span className="text-lg font-black text-slate-900">{stats.age || "—"}</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm">
               <span className="text-sm font-bold text-slate-500">Last Checkup</span>
               <span className="text-lg font-black text-emerald-600">Healthy</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function DoctorActivityChart({ data }) {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-slate-300">No data</div>;

  const maxValue = Math.max(...data.map(d => d.value), 5);
  const chartHeight = 200;
  
  return (
    <div className="flex items-end justify-between h-full w-full gap-2 pt-4 px-2">
      {data.map((day, i) => (
        <div key={i} className="flex-1 flex flex-col items-center group gap-3">
          <div className="w-full relative flex flex-col items-center">
             {/* Tooltip on hover */}
             <div className="absolute -top-8 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
               {day.value} Sessions
             </div>
             
             {/* Bar */}
             <div 
               className="w-full max-w-[40px] rounded-t-2xl bg-gradient-to-t from-blue-500 to-blue-400 group-hover:from-blue-600 group-hover:to-blue-500 transition-all duration-500 shadow-lg shadow-blue-100/50"
               style={{ height: `${(day.value / (maxValue * 1.2)) * chartHeight}px` }}
             />
             
             {/* Dynamic Glow background */}
             <div 
               className="w-full max-w-[40px] absolute bottom-0 bg-blue-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
               style={{ height: `${(day.value / (maxValue * 1.2)) * chartHeight}px` }}
             />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{day.name}</span>
        </div>
      ))}
    </div>
  );
}

function LabTenStatCard({ title, value, type, percentage }) {
  const styles = {
    revenue: {
      bg: "bg-white", text: "text-slate-800",
      badgeBg: "bg-blue-500 text-white", iconBg: "bg-pink-50 text-pink-500",
      bars: "bg-pink-500", mutedBars: "bg-pink-100"
    },
    completed: {
      bg: "bg-white", text: "text-slate-800",
      badgeBg: "bg-blue-500 text-white", iconBg: "bg-blue-50 text-blue-500",
      bars: "bg-blue-500", mutedBars: "bg-blue-100"
    },
    pending: {
      bg: "bg-white", text: "text-slate-800",
      badgeBg: "bg-blue-500 text-white", iconBg: "bg-teal-50 text-teal-500",
      bars: "bg-teal-400", mutedBars: "bg-teal-50"
    },
    cancelled: {
      bg: "bg-white", text: "text-slate-800",
      badgeBg: "bg-blue-500 text-white", iconBg: "bg-red-50 text-red-500",
      bars: "bg-red-500", mutedBars: "bg-red-100"
    },
  };

  const style = styles[type] || styles.completed;

  // Mock bar height pattern
  const barPattern = type === 'revenue' ? [5, 6, 8, 7, 9, 10, 8, 7, 6, 7, 9, 10, 12, 11, 9, 8, 7, 5] :
    type === 'completed' ? [4, 5, 7, 6, 8, 9, 7, 6, 5, 8, 10, 11, 9, 7, 6, 5, 4] :
      type === 'pending' ? [3, 4, 6, 5, 7, 8, 6, 5, 4, 7, 9, 8, 6, 5, 4, 3] :
        [2, 3, 5, 4, 6, 7, 5, 4, 3, 6, 8, 7, 5, 4, 3, 2];

  return (
    <Card className={`border border-slate-100 shadow-xl shadow-slate-100/50 rounded-[32px] ${style.bg} relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center mb-6 relative">
          <div className={`px-4 py-2 ${style.iconBg} rounded-full text-xs font-bold flex items-center gap-2 shadow-sm border border-white`}>
            <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>
            {title}
          </div>

          {/* Subtle colored shadow directly under title badge to match LabTen glow */}
          <div className={`absolute top-8 w-24 h-4 ${style.iconBg} blur-xl opacity-60 rounded-full`}></div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-end gap-1">
            <p className={`text-2xl lg:text-3xl font-extrabold ${style.text}`}>{value}</p>
            <span className="text-xs font-bold text-slate-400 mb-1 ml-1">Total</span>
          </div>
          <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${style.badgeBg} shadow-sm`}>{percentage}</div>
        </div>

        {/* Mini Bar Chart Mock */}
        <div className="flex items-end justify-between h-8 gap-[1px] md:gap-1 mt-auto">
          {barPattern.map((h, i) => (
            <div key={i} className={`w-1.5 md:w-2 rounded-full ${i < barPattern.length * (parseInt(percentage) / 100) ? style.bars : style.mutedBars}`} style={{ height: `${h * 8}%` }}></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Data mocks for new UI components
const mockAppointments = [
  { doctor: { name: "Dr. Tomás Rivera", role: "Dentist", img: "https://i.pravatar.cc/100?img=11" }, time: "10:00 AM", date: "Jul 2, 2025", patient: { name: "John Smith", age: "28", img: "https://i.pravatar.cc/100?img=12" }, treatment: "Dental Cleaning", payment: "Pending", status: "In progress" },
  { doctor: { name: "Dr. Lisa Ray", role: "Orthodontist", img: "https://i.pravatar.cc/100?img=5" }, time: "11:30 AM", date: "Jul 3, 2025", patient: { name: "Maya Patel", age: "34", img: "https://i.pravatar.cc/100?img=9" }, treatment: "Braces Checkup", payment: "Paid", status: "Completed" },
  { doctor: { name: "Dr. Ahmed Khan", role: "Hygienist", img: "https://i.pravatar.cc/100?img=15" }, time: "2:15 PM", date: "Jul 4, 2025", patient: { name: "Carlos Reyes", age: "30", img: "https://i.pravatar.cc/100?img=3" }, treatment: "Teeth Whitening", payment: "Unpaid", status: "Cancelled" }
];

const mockReviews = [
  { name: "Emily R.", date: "Jul 2, 2025", rating: "4.9", img: "https://i.pravatar.cc/100?img=1", text: "Amazing experience! The doctor was friendly and explained everything clearly. No waiting time." },
  { name: "James T", date: "Jul 2, 2025", rating: "5.0", img: "https://i.pravatar.cc/100?img=14", text: "Overall good, but the appointment started 10 minutes late. Staff were very helpful though." }
];

function StatCard({ title, value, icon: Icon, color, trend }) {
  const colors = {
    blue: "bg-slate-50 text-[#7BA1C7] shadow-slate-50",
    emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-100",
    amber: "bg-amber-50 text-amber-600 shadow-amber-100",
    violet: "bg-violet-50 text-violet-600 shadow-violet-100",
  };
  return (
    <Card className="border-none shadow-lg shadow-slate-50 rounded-[24px] bg-white hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl", colors[color])}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

function RevenueChart({ data }) {
  if (!data || !data.monthlyRevenue) {
    return <div>Loading chart...</div>;
  }

  const maxValue = Math.max(data.maxRevenue, 50000);
  const chartHeight = 200;
  const chartWidth = 800;
  const padding = 30;
  const pointSpacing = chartWidth / (data.monthlyRevenue.length - 1);

  // Generate SVG path
  let pathData = '';
  let points = [];

  for (let i = 0; i < data.monthlyRevenue.length; i++) {
    const x = padding + i * pointSpacing;
    const y = chartHeight - (data.monthlyRevenue[i] / maxValue) * (chartHeight - 20);
    points.push({ x, y, value: data.monthlyRevenue[i] });
    
    if (i === 0) {
      pathData += `M${x},${y}`;
    } else {
      // Smooth curve using quadratic Bezier
      const prevPoint = points[i - 1];
      const midX = (prevPoint.x + x) / 2;
      const midY = (prevPoint.y + y) / 2;
      pathData += ` Q${midX},${prevPoint.y} ${midX},${midY}`;
      pathData += ` Q${midX},${y} ${x},${y}`;
    }
  }

  // Close path for fill
  const closePath = pathData + ` L${chartWidth},${chartHeight} L0,${chartHeight} Z`;

  // Find max value for tooltip
  const maxValueData = Math.max(...data.monthlyRevenue);
  const maxIndex = data.monthlyRevenue.indexOf(maxValueData);
  const maxPointX = padding + maxIndex * pointSpacing;
  const maxPointY = chartHeight - (maxValueData / maxValue) * (chartHeight - 20);

  // Generate Y-axis labels dynamically
  const yAxisSteps = 5;
  const yLabels = [];
  for (let i = yAxisSteps; i >= 0; i--) {
    const value = (i / yAxisSteps) * maxValue;
    yLabels.push(value > 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`);
  }

  return (
    <>
      {/* Y Axis */}
      <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-[10px] text-slate-400 font-medium z-10">
        {yLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>

      {/* Grid Lines */}
      <div className="absolute left-10 right-0 top-0 bottom-8 flex flex-col justify-between z-0">
        {yLabels.map((_, i) => (
          <div key={i} className="w-full h-px bg-slate-50"></div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="absolute left-10 right-0 top-0 bottom-8 z-10 flex items-end overflow-hidden custom-scrollbar">
        <svg className="w-full h-full preserve-3d" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={closePath} fill="url(#gradientArea)" />
          <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="3" />
          
          {/* Highlight max point */}
          <g transform={`translate(${maxPointX}, ${maxPointY})`}>
            <line x1="0" y1="0" x2="0" y2={chartHeight - maxPointY} stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
            <circle cx="0" cy="0" r="6" fill="white" stroke="#3b82f6" strokeWidth="3" />
          </g>
        </svg>

        {/* Tooltip */}
        <div className="absolute" style={{ left: `${(maxPointX / chartWidth) * 100}%`, top: `${(maxPointY / chartHeight) * 100}%`, transform: 'translate(-50%, -120%)' }}>
          <div className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-600 shadow-md border border-blue-50 whitespace-nowrap">
            ${(maxValueData / 1000).toFixed(1)}k
          </div>
        </div>
      </div>

      {/* X Axis Labels */}
      <div className="absolute left-10 right-0 bottom-0 h-6 flex justify-between items-end text-[10px] text-slate-400 font-semibold px-2 z-10">
        {data.monthNames.map((month, i) => (
          <span key={i}>{month.toUpperCase()}</span>
        ))}
      </div>
    </>
  );
}