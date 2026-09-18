import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },   // "17:00"
    slotMinutes: { type: Number, default: 30 },
  },
  { timestamps: true }
);

export const Availability = mongoose.model("Availability", availabilitySchema);
