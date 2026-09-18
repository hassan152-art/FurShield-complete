import mongoose from "mongoose";

const careVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

export const CareVideo = mongoose.model("CareVideo", careVideoSchema);
