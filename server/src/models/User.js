import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["owner", "veterinarian", "shelter", "admin"],
      required: true,
      default: "owner",
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 8, select: false },
    contactNumber: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^[0-9]{11}$/.test(v),
        message: "Contact number must be exactly 11 digits",
      },
    },
    address: { type: String, trim: true },

    // Veterinarian-specific
    specialization: { type: String },
    experienceYears: { type: Number },

    // Shelter-specific
    shelterName: { type: String },
    contactPerson: { type: String },

    isActive: { type: Boolean, default: true },
    avatarUrl: { type: String },

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);
