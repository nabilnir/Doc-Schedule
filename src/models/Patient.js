import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  email: { type: String, required: true }, // <--- Ei line-ti oboshoy thakte hobe
  phone: { type: String },
  lastVisit: { type: Date, default: Date.now },
  totalVisits: { type: Number, default: 1 },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
}, { timestamps: true });

// Schema-te unique index add korle search fast hobe
PatientSchema.index({ email: 1 });

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);