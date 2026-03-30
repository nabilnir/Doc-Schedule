import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { format } from "date-fns";
import { Clock9, CalendarDays, Activity, User } from "lucide-react";
import FilterBar from "@/components/appointment/filter-bar";
import UpdateStatusDropdown from "@/components/appointment/update-status-dropdown";

export const dynamic = "force-dynamic";

export default async function DoctorAppointments({ searchParams }) {
  const session = await getServerSession(authOptions);

  // Authorization check
  if (!session || session.user.role !== "doctor") {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-red-500">Access Denied</h2>
        <p className="text-slate-500">Please sign in as a doctor to view your schedule.</p>
      </div>
    );
  }

  // Destructure search parameters with default values
  const { search = "", status = "", page = "1" } = await searchParams;
  const limit = 10;
  const skip = (parseInt(page) - 1) * limit;

  await connectDB();

  // Find the doctor profile
  const doctor = await Doctor.findOne({
      $or: [{ userId: session.user.id }, { email: session.user.email }]
  }).lean();

  if (!doctor) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-amber-500">Profile Not Found</h2>
        <p className="text-slate-500">We could not find your doctor profile. Please make sure you have completed the onboarding process.</p>
      </div>
    );
  }

  // Construct MongoDB Query based on filters and doctor _id
  const query = {
    $and: [
      { doctorId: doctor._id },
      search ? { patientName: { $regex: search, $options: "i" } } : {},
      status ? { status: status } : {},
    ],
  };

  // Fetch count and paginated data
  const totalAppointments = await Appointment.countDocuments(query);
  const rawData = await Appointment.find(query)
    .sort({ appointmentDate: -1 }) // Show newest appointments first
    .skip(skip)
    .limit(limit)
    .lean();

  const appointments = JSON.parse(JSON.stringify(rawData));
  const totalPages = Math.ceil(totalAppointments / limit);
  const currentPage = parseInt(page);

  return (
    <div className="p-6 md:p-10 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header with Counter and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Patient Appointments</h1>
            <span className="bg-[#7BA1C7] text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-sm">
              {totalAppointments} Total
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Manage all your upcoming and past consultations.</p>
        </div>
        
        <FilterBar placeholder="Search by patient name..." />
      </div>

      {/* Results Table Section */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 text-center border border-dashed flex flex-col items-center justify-center">
          <CalendarDays className="w-12 h-12 text-slate-200 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800">No appointments found</h3>
          <p className="text-slate-500 text-sm">Adjust your filters or wait for a patient to book a session.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50/50">
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Details</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Appointment Date</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Time Slot</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Payment</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#7BA1C7]">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{app.patientName}</span>
                          <span className="text-xs text-slate-400 font-medium uppercase mt-0.5">
                            {app.patientAge}y · {app.patientGender || "N/A"}
                          </span>
                        </div>
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
                    <td className="px-6 py-6 font-semibold">
                      {app.paymentStatus === 'paid' ? (
                        <span className="text-emerald-600">Paid</span>
                      ) : (
                        <span className="text-slate-400">Unpaid</span>
                      )}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <UpdateStatusDropdown 
                        appointmentId={app._id} 
                        currentStatus={app.status} 
                      />
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
