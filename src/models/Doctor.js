import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: String,
  education: String,
  specialty: { type: String, required: true },
  experience: String,
  hospital: String,
  phone: String,
  email: String,
  time_slots: [String],
  fee: Number,
  image: String
}, { 
  timestamps: true,
  collection: 'doctor' 
});


export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema, "doctor");