import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  doctorName: { type: String, required: true },
  timeSlot: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: "appointment" },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed'], 
    default: 'pending' 
  },
  
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);