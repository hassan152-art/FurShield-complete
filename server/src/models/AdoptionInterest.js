import mongoose from "mongoose";

const adoptionInterestSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "AdoptionListing", required: true, index: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contact: { type: String, required: true },
    address: { type: String },
    reason: { type: String },
    livingEnvironment: { type: String },
    previousExperience: { type: String },
    preferredContactMethod: { type: String },
    status: {
      type: String,
      enum: ["submitted", "reviewing", "contacted", "approved", "rejected", "adopted"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

export const AdoptionInterest = mongoose.model("AdoptionInterest", adoptionInterestSchema);
