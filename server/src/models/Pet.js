import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    species: { type: String, required: true },
    breed: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "unknown"], default: "unknown" },
    weight: { type: Number },
    color: { type: String },
    dateOfBirth: { type: Date },
    medicalHistory: { type: String },
    allergies: [{ type: String }],
    emergencyInfo: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export const Pet = mongoose.model("Pet", petSchema);
