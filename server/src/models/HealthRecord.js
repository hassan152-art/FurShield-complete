import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true, index: true },
    type: {
      type: String,
      enum: ["vaccination", "vet_visit", "treatment", "lab_result", "follow_up", "illness"],
      required: true,
    },
    title: { type: String, required: true },
    diagnosis: { type: String },
    medication: { type: String },
    notes: { type: String },
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, required: true, default: Date.now },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

export const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);
