
import PatientTable from "@/components/doctor/patient-table";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MyPatientsPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50/30">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          My Patients
        </h1>
        <p className="text-muted-foreground">
          Maintain and view detailed history of all your patients.
        </p>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <PatientTable />
      </Card>
    </div>
  );
}