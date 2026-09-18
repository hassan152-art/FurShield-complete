import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rescheduled", "completed", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// prevent double-booking the same vet at the same date/time
appointmentSchema.index({ veterinarian: 1, date: 1, time: 1 }, { unique: true, partialFilterExpression: { status: { $in: ["pending", "confirmed", "rescheduled"] } } });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
