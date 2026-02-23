import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, default: "appointment" },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);