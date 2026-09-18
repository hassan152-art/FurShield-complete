import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: [
        "vaccination_due", "grooming_reminder", "appointment_confirmation",
        "appointment_update", "appointment_reminder", "adoption_response", "product_arrival", "system",
      ],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false, index: true },
    link: { type: String },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
