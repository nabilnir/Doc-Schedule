import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { format } from "date-fns";
import { Clock9, CalendarDays, User, Activity } from "lucide-react";
import PaymentSuccessAlert from "@/components/appointment/payment-success-alert";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500">Please log in to view your bookings.</p>
      </div>
    );
  }

  await connectDB();

  // Find all appointments for the logged-in user
  const rawAppointments = await Appointment.find({
    $or: [
      { userEmail: session.user.email },
      { patientEmail: session.user.email }
    ]
  })
    .sort({ appointmentDate: 1 }) // Sort by date ascending
    .lean();

  const appointments = JSON.parse(JSON.stringify(rawAppointments));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Confirmed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>;
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 mx-1">My Bookings</h1>
        <p className="text-slate-500 mx-1">View and manage your consultation schedule.</p>
      </div>

      <PaymentSuccessAlert />

      {appointments.length === 0 ? (
        <div className="bg-white rounded-[32px] p-12 text-center border shadow-sm flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <CalendarDays className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No past or upcoming bookings</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            You haven't scheduled any appointments yet. Click the button below to find a doctor.
          </p>
          <a href="/dashboard/book-appointment" className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
            Book an Appointment
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50/50">
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Doctor</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Appointment Date</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Time Slot</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Details</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#7BA1C7]">
                          <Activity className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-900">{app.doctorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        {format(new Date(app.appointmentDate), "MMM do, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Clock9 className="w-4 h-4 text-slate-400" />
                        {app.timeSlot}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{app.patientName}</span>
                        <span className="text-xs text-slate-400 font-medium uppercase mt-0.5">
                          {app.patientAge}y · {app.patientGender || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      {getStatusBadge(app.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}