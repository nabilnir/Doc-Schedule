import connectDB from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import DoctorCard from "@/components/appointment/doctor-card";

export default async function Page() {
    await connectDB();

    const rawDoctors = await Doctor.find({}).lean();
    const doctors = JSON.parse(JSON.stringify(rawDoctors));

    return (
        <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 mx-1">Book an Appointment</h1>
                <p className="text-slate-500 mx-1">Find and schedule a consultation with our expert doctors.</p>
            </div>

            <div className="space-y-4">
                {doctors.map((doc) => (
                    <DoctorCard key={doc._id} doctor={doc} />
                ))}
            </div>
        </div>
    );
}
