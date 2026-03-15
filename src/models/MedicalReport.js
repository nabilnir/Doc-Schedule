import mongoose from "mongoose";

const MedicalReportSchema = new mongoose.Schema({
    patientEmail: { type: String, required: true, lowercase: true, trim: true },
    reportName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String }, // e.g., 'pdf', 'image'
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.MedicalReport || mongoose.model("MedicalReport", MedicalReportSchema);
