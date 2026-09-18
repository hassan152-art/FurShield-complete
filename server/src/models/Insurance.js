import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true, index: true },
    provider: { type: String, required: true },
    policyNumber: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    coverageInfo: { type: String },
    documents: [{ type: String }],
  },
  { timestamps: true }
);

export const Insurance = mongoose.model("Insurance", insuranceSchema);
