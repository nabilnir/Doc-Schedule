import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: String,
  education: String,
  specialty: { type: String, required: true },
  specializations: [{ type: String }], // Admin-managed tags e.g. ["Cardiology", "Neurology"]
  experience: String,
  hospital: String,
  phone: String,
  email: String,
  time_slots: [String],
  fee: Number,
  image: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  // --- Verification ---
  isVerified: { type: Boolean, default: false },
  registrationNumber: { type: String, default: null },
  credentialsUrl: { type: String, default: null },
  verificationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  // --- Slot Management ---
  blockedSlots: [{
    date: { type: String }, // ISO date string e.g. "2026-03-05"
    slots: [String]         // e.g. ["09:00 AM", "10:00 AM"]
  }],
  // --- Finance ---
  payoutStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  totalEarnings: { type: Number, default: 0 },
}, {
  timestamps: true,
  collection: 'doctor'
});

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema, "doctor");