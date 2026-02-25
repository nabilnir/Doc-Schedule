import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  doctorName: String,
  appointmentDate: Date,
  timeSlot: String,
  patientName: String,
  patientAge: Number,
  patientBloodGroup: String,
  patientEmail: String,
  status: { type: String, default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);