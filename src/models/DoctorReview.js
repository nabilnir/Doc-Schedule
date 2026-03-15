import mongoose from "mongoose";

const DoctorReviewSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctorName: { type: String },
    patientEmail: { type: String, required: true },
    patientName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    isFlagged: { type: Boolean, default: false },      // Admin flagged — hidden from public
    isApproved: { type: Boolean, default: true },       // Default visible, admin can un-approve
}, { timestamps: true });

export default mongoose.models.DoctorReview || mongoose.model("DoctorReview", DoctorReviewSchema);
