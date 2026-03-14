import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
    patientEmail: { type: String, required: true, lowercase: true, trim: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctorName: { type: String, required: true },
    details: { type: String, required: true },
    medicines: [{
        name: String,
        dosage: String,
        duration: String
    }],
    date: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Prescription || mongoose.model("Prescription", PrescriptionSchema);
