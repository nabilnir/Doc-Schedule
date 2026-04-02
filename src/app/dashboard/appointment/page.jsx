import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { format } from "date-fns";
import { Clock9, CalendarDays, Activity } from "lucide-react";
import PaymentSuccessAlert from "@/components/appointment/payment-success-alert";
import CancelButton from "@/components/appointment/cancel-button";
import Link from "next/link";
import FilterBar from "@/components/appointment/filter-bar";

export const dynamic = "force-dynamic";

/** Renders a colour-coded pill badge for a given appointment status */
function getStatusBadge(status) {
  const s = (status || "pending").toLowerCase();
  const styles = {
    confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    pending: "bg-amber-50 text-amber-700 border border-amber-100",
    cancelled: "bg-red-50 text-red-600 border border-red-100",
    completed: "bg-blue-50 text-blue-700 border border-blue-100",
  };
  const label = s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${styles[s] || "bg-slate-100 text-slate-500 border border-slate-200"}`}>
      {label}
    </span>
  );
}

export default async function MyBookingsPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  // Authorization check
  if (!session) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-red-500">Access Denied</h2>
        <p className="text-slate-500">Please sign in to view your bookings.</p>
      </div>
    );
  }

  // Destructure search parameters with default values
  const { search = "", status = "", page = "1" } = await searchParams;
  const limit = 10;
  const skip = (parseInt(page) - 1) * limit;

  await connectDB();

  // Construct MongoDB Query
  const query = {
    $and: [
      { $or: [{ userEmail: session.user.email }, { patientEmail: session.user.email }] },
      search ? { doctorName: { $regex: search, $options: "i" } } : {},
      status ? { status: status } : {},
    ],
  };

  // Fetch count and paginated data
  const totalAppointments = await Appointment.countDocuments(query);
  const rawData = await Appointment.find(query)
    .sort({ appointmentDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const appointments = JSON.parse(JSON.stringify(rawData));
  const totalPages = Math.ceil(totalAppointments / limit);
  const currentPage = parseInt(page);

  return (
    <div className="p-6 md:p-10 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
            <span className="bg-blue-600 text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-sm">
              {totalAppointments} Total
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Manage and track your medical appointments.</p>
        </div>
        <FilterBar />
      </div>

      <PaymentSuccessAlert />

      {/* Results Section */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 text-center border border-dashed flex flex-col items-center justify-center">
          <CalendarDays className="w-12 h-12 text-slate-200 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800">No appointments found</h3>
          <p className="text-slate-500 text-sm">Adjust your filters or book a new session.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b">
                  <tr>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Schedule</th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Patient Details</th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <Activity className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-900">{app.doctorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-800 text-sm">
                          {format(new Date(app.appointmentDate), "MMM do, yyyy")}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock9 className="w-3 h-3" /> {app.timeSlot}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-sm">{app.patientName}</span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                            {app.patientAge}y · {app.patientGender || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {app.status !== "cancelled" && (
                          <CancelButton
                            appointmentId={app._id}
                            appointmentDate={app.appointmentDate}
                            timeSlot={app.timeSlot}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-2 pb-10">
            <p className="text-xs text-slate-500">
              Showing <span className="text-slate-900 font-bold">{skip + 1}</span> to{" "}
              <span className="text-slate-900 font-bold">
                {Math.min(skip + limit, totalAppointments)}
              </span>{" "}
              of {totalAppointments} bookings
            </p>
            <div className="flex gap-2">
              <Link
                href={`?page=${currentPage - 1}&search=${search}&status=${status}`}
                className={`px-4 py-2 text-xs border rounded-xl font-bold transition-all ${
                  currentPage <= 1 ? "pointer-events-none opacity-30" : "hover:bg-white hover:shadow-sm"
                }`}
              >
                Previous
              </Link>
              <Link
                href={`?page=${currentPage + 1}&search=${search}&status=${status}`}
                className={`px-4 py-2 text-xs border rounded-xl font-bold transition-all ${
                  currentPage >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-white hover:shadow-sm"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}