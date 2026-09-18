import mongoose from "mongoose";

const medicalDocumentSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true, index: true },
    label: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const MedicalDocument = mongoose.model("MedicalDocument", medicalDocumentSchema);
