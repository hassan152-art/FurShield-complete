import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["veterinarian", "shelter", "product"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

reviewSchema.index({ author: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
