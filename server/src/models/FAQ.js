import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String },
  },
  { timestamps: true }
);

export const FAQ = mongoose.model("FAQ", faqSchema);
