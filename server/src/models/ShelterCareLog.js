import mongoose from "mongoose";

const shelterCareLogSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "AdoptionListing", required: true, index: true },
    type: { type: String, enum: ["feeding", "grooming", "exercise", "medication", "medical", "note"], required: true },
    notes: { type: String },
    loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const ShelterCareLog = mongoose.model("ShelterCareLog", shelterCareLogSchema);
