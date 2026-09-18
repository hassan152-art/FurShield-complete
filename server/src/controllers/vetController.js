import { User } from "../models/User.js";
import { Availability } from "../models/Availability.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listVets = asyncHandler(async (req, res) => {
  const { specialization, location, q } = req.query;
  const filter = { role: "veterinarian", isActive: true };
  if (specialization) filter.specialization = new RegExp(specialization, "i");
  if (location) filter.address = new RegExp(location, "i");
  if (q) filter.name = new RegExp(q, "i");
  const vets = await User.find(filter).select("-password");
  return ok(res, { vets }, "Veterinarians fetched");
});

export const getVet = asyncHandler(async (req, res) => {
  const vet = await User.findOne({ _id: req.params.id, role: "veterinarian" }).select("-password");
  if (!vet) return fail(res, "Veterinarian not found", 404);
  const availability = await Availability.find({ veterinarian: vet._id });
  return ok(res, { vet, availability }, "Veterinarian fetched");
});

// Simple rule-based recommendation using specialization keywords mapped to conditions
const CONDITION_SPECIALIZATION_MAP = {
  "skin allergy": ["dermatology", "general"],
  "dental": ["dentistry", "general"],
  "broken bone": ["orthopedics", "surgery"],
  "vaccination": ["general"],
  "eye": ["ophthalmology", "general"],
  "heart": ["cardiology"],
};

export const recommendVets = asyncHandler(async (req, res) => {
  const { condition, location } = req.query;
  const key = Object.keys(CONDITION_SPECIALIZATION_MAP).find((k) =>
    (condition || "").toLowerCase().includes(k)
  );
  const specializations = key ? CONDITION_SPECIALIZATION_MAP[key] : ["general"];

  const filter = {
    role: "veterinarian",
    isActive: true,
    specialization: { $in: specializations.map((s) => new RegExp(s, "i")) },
  };
  if (location) filter.address = new RegExp(location, "i");

  const vets = await User.find(filter).select("-password");
  return ok(res, { vets, matchedSpecializations: specializations }, "Recommended veterinarians");
});

export const updateAvailability = asyncHandler(async (req, res) => {
  const { slots } = req.body; // array of { dayOfWeek, startTime, endTime, slotMinutes }
  await Availability.deleteMany({ veterinarian: req.user._id });
  const created = await Availability.insertMany(
    (slots || []).map((s) => ({ ...s, veterinarian: req.user._id }))
  );
  return ok(res, { availability: created }, "Availability updated");
});
