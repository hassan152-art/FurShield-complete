import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    itemType: { type: String, enum: ["veterinarian", "adoption", "product", "article"], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

savedItemSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

export const SavedItem = mongoose.model("SavedItem", savedItemSchema);
