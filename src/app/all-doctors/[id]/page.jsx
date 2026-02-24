import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { notFound } from "next/navigation";
import BookingSystem from "@/components/appointment/booking-system";
import Image from "next/image";

export default async function DoctorDetails({ params }) {
  await connectDB();
  const { id } = await params;
  const rawDoctor = await Doctor.findById(id).lean();

  if (!rawDoctor) return notFound();

  // Serialization for Client Component
  const doctor = JSON.parse(JSON.stringify(rawDoctor));

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Basic Info */}
        <div className="md:col-span-1 bg-slate-50 p-6 rounded-2xl border">
          <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-blue-600">
            <div className="h-32 w-32 relative rounded-full">
              <Image
                src={
                  doctor.image ||
                  "https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
                }
                alt="Doctor Illustration"
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center">{doctor.name}</h2>
          <p className="text-center text-blue-600 font-medium">
            {doctor.specialty}
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <p>
              <strong>Email:</strong> {doctor.email}
            </p>
            <p>
              <strong>Phone:</strong> {doctor.phone}
            </p>
            <p>
              <strong>Fee:</strong> ৳ {doctor.fee}
            </p>
          </div>
        </div>

        {/* Right: Info & Interactive Booking */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h3 className="text-xl font-bold border-b pb-2">
              Professional Info
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-2 text-slate-600">
              <p>
                <strong>Designation:</strong> {doctor.designation}
              </p>
              <p>
                <strong>Education:</strong> {doctor.education}
              </p>
              <p>
                <strong>Current Hospital:</strong> {doctor.hospital}
              </p>
              <p>
                <strong>Experience:</strong> {doctor.experience}
              </p>
            </div>
          </section>

          {/* Booking Component Integration */}
          <section className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-xl font-bold mb-4">Book Your Appointment</h3>
            <BookingSystem doctor={doctor} />
          </section>
        </div>
      </div>
    </div>
  );
}
