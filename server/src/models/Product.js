import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ["food", "grooming", "toys", "accessories", "health_supplies", "training_aids"],
      required: true,
      index: true,
    },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
