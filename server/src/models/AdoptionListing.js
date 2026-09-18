import mongoose from "mongoose";

const adoptionListingSchema = new mongoose.Schema(
  {
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    species: { type: String, required: true, index: true },
    breed: { type: String },
    age: { type: Number },
    gender: { type: String },
    location: { type: String, index: true },
    healthStatus: { type: String },
    personality: { type: String },
    images: [{ type: String }],
    videoUrl: { type: String },
    status: {
      type: String,
      enum: ["available", "pending", "adopted"],
      default: "available",
      index: true,
    },
  },
  { timestamps: true }
);

export const AdoptionListing = mongoose.model("AdoptionListing", adoptionListingSchema);
