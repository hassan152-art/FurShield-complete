import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["requested", "confirmed", "processing", "completed", "cancelled"],
      default: "requested",
    },
    note: {
      type: String,
      default: "This is an order request only. Payment and physical delivery are outside the scope of this application.",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
