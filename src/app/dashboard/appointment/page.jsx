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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((app) => (
            <div key={app._id} className="bg-white rounded-[24px] p-6 border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative overflow-hidden group">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#7BA1C7] opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Doctor</p>
                  <h3 className="font-bold text-lg text-slate-900">{app.doctorName}</h3>
                </div>
                {getStatusBadge(app.status)}
              </div>

              <div className="space-y-4 mb-6 flex-1">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#7BA1C7] shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Date</p>
                    <p className="font-medium">{format(new Date(app.appointmentDate), "EEEE, MMMM do, yyyy")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#7BA1C7] shrink-0">
                    <Clock9 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Time</p>
                    <p className="font-medium">{app.timeSlot}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Patient Details</p>
                    <p className="font-medium text-sm">
                      {app.patientName} <span className="opacity-50">({app.patientAge}y, {app.patientGender || "N/A"})</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}