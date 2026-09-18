import { ShelterCareLog } from "../models/ShelterCareLog.js";
import { AdoptionListing } from "../models/AdoptionListing.js";
import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addCareLog = asyncHandler(async (req, res) => {
  const listing = await AdoptionListing.findOne({ _id: req.params.listingId, shelter: req.user._id });
  if (!listing) return fail(res, "Listing not found", 404);
  const log = await ShelterCareLog.create({ ...req.body, listing: listing._id, loggedBy: req.user._id });
  return ok(res, { log }, "Care log added", 201);
});

export const listCareLogs = asyncHandler(async (req, res) => {
  const logs = await ShelterCareLog.find({ listing: req.params.listingId }).sort({ createdAt: -1 });
  return ok(res, { logs }, "Care logs fetched");
});

export const myListings = asyncHandler(async (req, res) => {
  const listings = await AdoptionListing.find({ shelter: req.user._id }).sort({ createdAt: -1 });
  return ok(res, { listings }, "Shelter listings fetched");
});
