import mongoose from "mongoose";

const shelterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    description: { type: String },
    address: { type: String },
    logoUrl: { type: String },
  },
  { timestamps: true }
);

export const Shelter = mongoose.model("Shelter", shelterSchema);
