import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // Patient model-er sathe link kora holo
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "Prescription", // e.g., Prescription, Lab Report, Follow-up
    },
    doctor: {
      type: String,
      required: true,
      default: "Dr. Mukit",
    },
    diagnosis: {
      type: String,
      required: true, // Ki hoiche (e.g., Fever, Gastritis)
    },
    medicines: {
      type: String,
      required: true, // Oshud er talika
    },
    note: {
      type: String,
      default: "", // Extra instructions
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // CreatedAt ebong UpdatedAt auto create hobe
  }
);

// Model export kora (Next.js-er jonno check kora hoy jate bar bar model compile na hoy)
const Record = mongoose.models.Record || mongoose.model("Record", RecordSchema);

export default Record;