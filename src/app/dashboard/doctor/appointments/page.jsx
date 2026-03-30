import connectDB from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { format } from "date-fns";
import { Clock9, CalendarDays, Activity, User, Mail, Search } from "lucide-react";
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
    <div className="p-6 md:p-10 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-slate-50 min-h-screen">
      {/* Header with Counter and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Patient Requests</h1>
            <span className="bg-[#7BA1C7] text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-sm">
              {totalAppointments} Total
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Manage your upcoming consultations and patient details.</p>
        </div>
        
        <FilterBar placeholder="Search by patient name..." />
      </div>

      {/* Results Section - Grid of Cards */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 text-center border border-dashed flex flex-col items-center justify-center">
          <CalendarDays className="w-12 h-12 text-slate-200 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800">No appointments found</h3>
          <p className="text-slate-500 text-sm">Adjust your filters or wait for a patient to book a session.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {appointments.map((app) => (
            <div key={app._id} className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#7BA1C7] font-bold text-lg">
                    {app.patientName ? app.patientName[0] : "P"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{app.patientName}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      app.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                      app.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  Booked on: {format(new Date(app.createdAt || app.appointmentDate), "MMM dd, yyyy")}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                <div className="flex items-center gap-2 text-slate-600">
                  <CalendarDays className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">{format(new Date(app.appointmentDate), "PPP")}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock9 className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">{app.timeSlot}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">{app.patientAge} Years • {app.patientGender}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium">Blood: {app.patientBloodGroup || "N/A"}</span>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Contact Email</span>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="text-sm text-[#7BA1C7] font-medium">{app.patientEmail}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                   {/* Combined feature: Keep the status dropdown from our version */}
                  <UpdateStatusDropdown 
                    appointmentId={app._id} 
                    currentStatus={app.status} 
                  />
                  <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                    View Records
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination (If applicable) */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
           {/* Simple pagination indicator */}
           <p className="text-sm text-slate-400">Page {currentPage} of {totalPages}</p>
        </div>
      )}
    </div>
  );
}
