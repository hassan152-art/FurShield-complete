import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String },
    linkLabel: { type: String, default: "Learn more" },
    type: {
      type: String,
      enum: ["hero", "promo", "utility"],
      required: true,
      default: "promo",
    },
    // Tailwind-friendly hex background used behind the text on promo/utility banners
    backgroundColor: { type: String, default: "#BFE8D5" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

bannerSchema.index({ type: 1, isActive: 1, order: 1 });

export const Banner = mongoose.model("Banner", bannerSchema);
