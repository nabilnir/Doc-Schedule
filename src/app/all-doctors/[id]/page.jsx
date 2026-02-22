import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DoctorDetails({ params }) {
  await connectDB();
  const { id } = await params;
  const doctor = await Doctor.findById(id).lean();

  if (!doctor) return notFound();

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Basic Info */}
        <div className="md:col-span-1 bg-slate-50 p-6 rounded-2xl border">
          <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-blue-600">
            {doctor.name.charAt(4)} 
          </div>
          <h2 className="text-2xl font-bold text-center">{doctor.name}</h2>
          <p className="text-center text-blue-600 font-medium">{doctor.specialty}</p>
          <div className="mt-6 space-y-3 text-sm">
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>
            <p><strong>Fee:</strong> ৳ {doctor.fee}</p>
          </div>
        </div>

        {/* Right: Education & Slots */}
        <div className="md:col-span-2 space-y-6">
          <section>
            <h3 className="text-xl font-bold border-b pb-2">Professional Info</h3>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <p><strong>Designation:</strong> {doctor.designation}</p>
              <p><strong>Education:</strong> {doctor.education}</p>
              <p><strong>Current Hospital:</strong> {doctor.hospital}</p>
              <p><strong>Experience:</strong> {doctor.experience}</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b pb-2">Available Time Slots</h3>
            <div className="flex flex-wrap gap-3 mt-4">
              {doctor.time_slots.map((slot, index) => (
                <div key={index} className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md font-medium">
                  {slot}
                </div>
              ))}
            </div>
          </section>

          <Button size="lg" className="w-full md:w-auto">Book Appointment Now</Button>
        </div>
      </div>
    </div>
  );
}