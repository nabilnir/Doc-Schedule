import mongoose from "mongoose";

const SystemLogSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["booking", "auth", "notification"],
        required: true,
    },
    status: {
        type: String,
        enum: ["success", "error"],
        required: true,
    },
    message: { type: String, required: true },
    errorDetails: { type: String, default: null },
    userEmail: { type: String, default: null },
}, { timestamps: true });

export default mongoose.models.SystemLog || mongoose.model("SystemLog", SystemLogSchema);
