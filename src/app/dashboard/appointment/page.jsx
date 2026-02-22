// app/dashboard/appointment/page.jsx
import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import DoctorCard from "@/components/appointment/doctor-card";

export default async function Page() {
  await connectDB();
  
  const rawDoctors = await Doctor.find({}).lean();
  const doctors = JSON.parse(JSON.stringify(rawDoctors));

  return (
    <div className="p-10 space-y-4">
      {doctors.map((doc) => (
        <DoctorCard key={doc._id} doctor={doc} />
      ))}
    </div>
  );
}