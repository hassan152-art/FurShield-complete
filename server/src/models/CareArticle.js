import mongoose from "mongoose";

const careArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ["feeding", "hygiene", "exercise", "grooming", "vaccination", "training", "general_health", "emergency_care"],
      required: true,
      index: true,
    },
    coverImage: { type: String },
    author: { type: String },
    readingTimeMinutes: { type: Number, default: 5 },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const CareArticle = mongoose.model("CareArticle", careArticleSchema);
